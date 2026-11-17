import { Router } from "express";
import {
    getAllUsers,
    deleteUser,
    getAllEbooks,
    publishEbook,
    deleteEbook,
    getEbookDetails,
    getGridFSFile,
    getAllContactMessages,
    getContactMessageDetails,
    deleteContactMessage,
} from "../controller/admin.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { uploadEbookFiles } from "../middleware/upload.middleware.js";

const router = Router();

// Protect ALL admin endpoints (including admin file viewing/downloading) with BOTH auth and admin role verification
router.use(authMiddleware, isAdmin);

// File streaming endpoint for GridFS (covers and digital assets) - Admin only
router.get("/ebooks/files/:fileId", getGridFSFile);

// User management routes
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// eBook management routes
router.get("/ebooks", getAllEbooks);
router.post("/ebooks", uploadEbookFiles, publishEbook);
router.get("/ebooks/:id", getEbookDetails);
router.delete("/ebooks/:id", deleteEbook);

// Contact message management routes
router.get("/messages", getAllContactMessages);
router.get("/messages/:id", getContactMessageDetails);
router.delete("/messages/:id", deleteContactMessage);

export default router;
