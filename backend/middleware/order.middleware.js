import mongoose from "mongoose";
import { Order } from "../models/order.model.js";

/**
 * Middleware to verify that the requesting user owns the order, or is an admin.
 * Attaches the fetched order to `req.order`.
 */
export const orderAccessMiddleware = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID format",
            });
        }

        const order = await Order.findById(orderId).populate("items.ebook", "title slug coverImage digitalFile isPublished");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const currentUserId = req.user?.id?.toString();
        const isAdmin = req.user?.role?.toLowerCase() === "admin";
        const isOwner = order.user?.toString() === currentUserId;

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You do not have permission to view this order.",
            });
        }

        req.order = order;
        next();
    } catch (error) {
        console.error("Order access verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify order access permissions",
        });
    }
};

export default orderAccessMiddleware;
