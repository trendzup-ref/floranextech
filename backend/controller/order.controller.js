import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { EBook } from "../models/eBook.model.js";
import { streamGridFSFile } from "../utils/gridfs.js";
import { createPayPalServerOrder, capturePayPalServerOrder } from "../utils/paypal.js";

/**
 * Public/Protected endpoint to expose only the public PayPal Client ID to the frontend.
 * (Secret is never leaked!)
 */
export const getPayPalClientId = (req, res) => {
    const clientId = process.env.PAYPAL_CLIENT_ID || "";
    return res.status(200).json({
        success: true,
        clientId,
        currency: "EUR",
    });
};

/**
 * Create a new local order entity for an eBook.
 * Authoritatively calculates price from DB records and attaches to current user.
 */
export const createOrder = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { ebookId, items, paymentMethod = "paypal", currency = "EUR" } = req.body;

        // Support single ebookId or array of items [{ ebookId }]
        let productIds = [];
        if (ebookId) {
            productIds = [ebookId];
        } else if (Array.isArray(items) && items.length > 0) {
            productIds = items.map((i) => i.ebookId || i._id || i.id).filter(Boolean);
        }

        if (productIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please specify at least one eBook or product to order.",
            });
        }

        // Validate ObjectIds
        const validIds = productIds.every((id) => mongoose.Types.ObjectId.isValid(id));
        if (!validIds) {
            return res.status(400).json({
                success: false,
                message: "One or more product IDs are invalid.",
            });
        }

        // Query database to get authoritative prices and titles (never trust client-sent prices)
        const ebooks = await EBook.find({
            _id: { $in: productIds },
            isPublished: true,
        });

        if (!ebooks || ebooks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No active products found for this order.",
            });
        }

        // Check if user already owns any of these items through a completed, fulfilled order
        const existingCompletedOrder = await Order.findOne({
            user: userId,
            paymentStatus: "completed",
            orderStatus: "completed",
            isFulfilled: true,
            "items.ebook": { $in: ebooks.map((e) => e._id) },
        });

        if (existingCompletedOrder) {
            // Return existing order information with download readiness rather than a blocking error
            return res.status(200).json({
                success: true,
                alreadyPurchased: true,
                message: "You have already purchased this product. You can download it directly.",
                order: {
                    id: existingCompletedOrder._id,
                    items: existingCompletedOrder.items,
                    totalAmount: existingCompletedOrder.totalAmount,
                    currency: existingCompletedOrder.currency,
                    paymentMethod: existingCompletedOrder.paymentMethod,
                    paymentStatus: existingCompletedOrder.paymentStatus,
                    orderStatus: existingCompletedOrder.orderStatus,
                    createdAt: existingCompletedOrder.createdAt,
                },
            });
        }

        // Construct verified order items
        const orderItems = ebooks.map((item) => ({
            ebook: item._id,
            title: item.title,
            slug: item.slug,
            price: Number(item.price),
            coverImageUrl: item.coverImage?.url || "",
        }));

        // Calculate total amount from server-side database records
        const totalAmount = orderItems.reduce((acc, curr) => acc + curr.price, 0);

        // Build new order
        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount: Number(totalAmount.toFixed(2)),
            currency: currency.toUpperCase(),
            paymentMethod,
            paymentStatus: totalAmount === 0 ? "completed" : "pending",
            orderStatus: totalAmount === 0 ? "completed" : "created",
            isFulfilled: totalAmount === 0,
            fulfilledAt: totalAmount === 0 ? new Date() : null,
        });

        // Increment sales count if free order completed immediately
        if (totalAmount === 0) {
            await EBook.updateMany(
                { _id: { $in: ebooks.map((e) => e._id) } },
                { $inc: { salesCount: 1 } }
            );
        }

        return res.status(201).json({
            success: true,
            message: totalAmount === 0 ? "Free product activated successfully" : "Order initiated successfully. Proceed with payment.",
            order: {
                id: order._id,
                items: order.items,
                totalAmount: order.totalAmount,
                currency: order.currency,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus,
                createdAt: order.createdAt,
            },
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the order.",
        });
    }
};

/**
 * Creates a server-side PayPal checkout order for a specific Floranextech local order.
 * Invoked by PayPalButtons `createOrder`.
 */
export const createPayPalTransaction = async (req, res) => {
    try {
        const order = req.order; // Attached by orderAccessMiddleware

        if (order.paymentStatus === "completed") {
            return res.status(400).json({
                success: false,
                message: "This order has already been paid and completed.",
            });
        }

        const paypalOrder = await createPayPalServerOrder({
            amount: order.totalAmount,
            currency: order.currency || "EUR",
            customId: order._id.toString(),
            description: order.items.map((i) => i.title).join(", ").slice(0, 120),
        });

        // Save PayPal order ID to local order
        order.paypalDetails.orderId = paypalOrder.id;
        await order.save();

        return res.status(200).json({
            success: true,
            paypalOrderId: paypalOrder.id,
        });
    } catch (error) {
        console.error("Error creating PayPal transaction:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to initialize PayPal transaction.",
        });
    }
};

/**
 * Capture / Record PayPal payment completion directly on PayPal API.
 * Invoked by PayPalButtons `onApprove`.
 */
export const capturePayPalOrder = async (req, res) => {
    try {
        const order = req.order; // Attached by orderAccessMiddleware
        const { paypalOrderId } = req.body;

        const effectivePayPalId = paypalOrderId || order.paypalDetails?.orderId;

        if (!effectivePayPalId) {
            return res.status(400).json({
                success: false,
                message: "PayPal Order ID is required for capture verification.",
            });
        }

        if (order.paymentStatus === "completed") {
            return res.status(200).json({
                success: true,
                message: "Order has already been confirmed and paid.",
                order,
            });
        }

        // Execute server-side capture through PayPal REST API
        let captureData;
        try {
            captureData = await capturePayPalServerOrder(effectivePayPalId);
        } catch (captureErr) {
            console.error("PayPal API capture error:", captureErr);
            return res.status(400).json({
                success: false,
                message: `PayPal capture failed: ${captureErr.message}`,
            });
        }

        const isSuccess =
            captureData.status === "COMPLETED" ||
            captureData.purchase_units?.[0]?.payments?.captures?.[0]?.status === "COMPLETED";

        if (!isSuccess) {
            return res.status(400).json({
                success: false,
                message: "Payment was not marked as completed by PayPal.",
                details: captureData,
            });
        }

        const captureItem = captureData.purchase_units?.[0]?.payments?.captures?.[0];

        // Update local order entity
        order.paymentStatus = "completed";
        order.orderStatus = "completed";
        order.isFulfilled = true;
        order.fulfilledAt = new Date();
        order.paypalDetails = {
            orderId: effectivePayPalId,
            captureId: captureItem?.id || null,
            payerId: captureData.payer?.payer_id || null,
            payerEmail: captureData.payer?.email_address || null,
            paymentTime: new Date(),
            rawResponse: captureData,
        };

        await order.save();

        // Increment salesCount for each purchased eBook
        const ebookIds = order.items.map((i) => i.ebook);
        await EBook.updateMany(
            { _id: { $in: ebookIds } },
            { $inc: { salesCount: 1 } }
        );

        return res.status(200).json({
            success: true,
            message: "Payment captured and digital product unlocked successfully!",
            order,
        });
    } catch (error) {
        console.error("Error capturing PayPal order:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to finalize payment and complete order.",
        });
    }
};

/**
 * Fetch all orders placed by the currently logged-in user.
 */
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const [orders, totalOrders] = await Promise.all([
            Order.find({ user: userId })
                .populate("items.ebook", "title slug coverImage")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Order.countDocuments({ user: userId }),
        ]);

        const totalPages = Math.ceil(totalOrders / limit);

        return res.status(200).json({
            success: true,
            orders,
            pagination: {
                totalOrders,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve your orders.",
        });
    }
};

/**
 * Get details for a specific order.
 */
export const getOrderDetails = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            order: req.order, // Attached by orderAccessMiddleware
        });
    } catch (error) {
        console.error("Error retrieving order details:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get order details.",
        });
    }
};

/**
 * Download the purchased eBook's digital asset from MongoDB GridFS.
 * Ensures the requesting user actually owns a completed, paid order for the product.
 */
export const downloadPurchasedEbook = async (req, res) => {
    try {
        const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").trim().replace(/\/$/, "");
        const userId = req.user?.id;
        const { ebookId } = req.params;

        // Check if request is an explicit programmatic JSON call
        const isJsonExpected = req.headers.accept && req.headers.accept.includes("application/json") && !req.headers.accept.includes("text/html");

        // Helper redirect function
        const redirectToAccessDenied = (reason) => {
            if (isJsonExpected) {
                return res.status(403).json({
                    success: false,
                    redirect: `${clientUrl}/access-denied?reason=${reason}`,
                    message: "Access forbidden: Unauthorized or purchase not completed.",
                });
            }
            return res.redirect(`${clientUrl}/access-denied?reason=${reason}`);
        };

        // 1. Strict authentication check
        if (!userId) {
            return redirectToAccessDenied("unauthenticated");
        }

        // 2. Validate eBook ID format
        if (!ebookId || !mongoose.Types.ObjectId.isValid(ebookId)) {
            return redirectToAccessDenied("invalid_id");
        }

        const ebookObjectId = new mongoose.Types.ObjectId(ebookId);

        // 3. Strict purchase and payment verification:
        // User must have an active order that is verified as completed, paid, and fulfilled
        const purchasedOrder = await Order.findOne({
            user: userId,
            paymentStatus: "completed",
            orderStatus: "completed",
            isFulfilled: true,
            "items.ebook": ebookObjectId,
        });

        if (!purchasedOrder) {
            return redirectToAccessDenied("not_purchased");
        }

        const ebook = await EBook.findById(ebookObjectId);
        if (!ebook || !ebook.digitalFile?.fileId) {
            return redirectToAccessDenied("not_found");
        }

        // Stream file directly from GridFS to user with download prompt
        await streamGridFSFile(ebook.digitalFile.fileId, res, true);
    } catch (error) {
        console.error("Error downloading purchased asset:", error);
        return res.status(500).json({
            success: false,
            message: "Error downloading purchased digital asset.",
        });
    }
};
