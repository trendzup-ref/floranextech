import { Router } from "express";
import {
    getPayPalClientId,
    createOrder,
    createPayPalTransaction,
    capturePayPalOrder,
    getUserOrders,
    getOrderDetails,
    downloadPurchasedEbook,
} from "../controller/order.controller.js";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth.middleware.js";
import { orderAccessMiddleware } from "../middleware/order.middleware.js";

const router = Router();

// 1. Download purchased eBook asset (handles both direct browser navigation and API calls, uses optional auth so it can redirect unauthenticated users cleanly to /access-denied)
router.get("/download/:ebookId", optionalAuthMiddleware, downloadPurchasedEbook);

// All subsequent checkout & order routes require authentication
router.use(authMiddleware);

// 2. Get PayPal Client ID safely from backend
router.get("/paypal-client-id", getPayPalClientId);

// 3. Create a new local order (calculates totals and reserves pending state)
router.post("/", createOrder);

// 4. User's personal order history
router.get("/my-orders", getUserOrders);

// 5. Get specific order details (verified ownership)
router.get("/:orderId", orderAccessMiddleware, getOrderDetails);

// 6. Create server-side PayPal order for an initiated local order
router.post("/:orderId/create-paypal-order", orderAccessMiddleware, createPayPalTransaction);

// 7. Capture / confirm PayPal payment
router.post("/:orderId/capture-paypal", orderAccessMiddleware, capturePayPalOrder);

export default router;
