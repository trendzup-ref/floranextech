import mongoose from "mongoose";
import { EBook } from "../models/eBook.model.js";
import { Order } from "../models/order.model.js";
import { streamGridFSFile } from "../utils/gridfs.js";

/**
 * Public controller to get all published eBooks with pagination and optional search filter.
 */
export const getPublicEbooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 12;
        const skip = (page - 1) * limit;

        const search = req.query.search || '';

        const query = { isPublished: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const [ebooks, totalEbooks] = await Promise.all([
            EBook.find(query)
                .select("title slug description price category coverImage createdAt")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            EBook.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalEbooks / limit);

        return res.status(200).json({
            success: true,
            message: "eBooks fetched successfully",
            ebooks,
            pagination: {
                totalEbooks,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        console.error("Error fetching public eBooks:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch eBooks",
        });
    }
};

/**
 * Public controller to get a single eBook by its slug.
 */
export const getPublicEbookBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const ebook = await EBook.findOne({
            slug: slug.toLowerCase(),
            isPublished: true,
        }).select("-digitalFile.fileId"); // Keep digital file secure from public details

        if (!ebook) {
            return res.status(404).json({
                success: false,
                message: "eBook not found",
            });
        }

        // Check if the current user (if logged in) has already purchased this eBook
        let hasPurchased = false;
        if (req.user?.id) {
            // Note: Normal accounts must have a completed, fulfilled order.
            const purchasedOrder = await Order.findOne({
                user: req.user.id,
                paymentStatus: "completed",
                orderStatus: "completed",
                isFulfilled: true,
                "items.ebook": ebook._id,
            });
            hasPurchased = !!purchasedOrder;
        }

        return res.status(200).json({
            success: true,
            ebook,
            hasPurchased,
        });
    } catch (error) {
        console.error("Error fetching eBook by slug:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch eBook details",
        });
    }
};

/**
 * Public streaming of eBook cover images from GridFS.
 */
export const getPublicGridFSFile = async (req, res) => {
    try {
        const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").trim().replace(/\/$/, "");
        const { fileId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ success: false, message: "Invalid file ID" });
        }

        // Security check: Only allow streaming if this fileId belongs to an eBook cover image
        // (Prevents bypassing payment/auth to download digital asset files via public route)
        const isCover = await EBook.exists({ "coverImage.fileId": fileId });
        if (!isCover) {
            // If someone attempts to hit a raw digital asset fileId via the public route, redirect to /access-denied
            return res.redirect(`${clientUrl}/access-denied?reason=not_purchased`);
        }

        await streamGridFSFile(fileId, res, false);
    } catch (error) {
        console.error("Error streaming public file:", error);
        return res.status(500).json({ success: false, message: "Error retrieving image" });
    }
};
