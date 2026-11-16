import { Router } from "express";
import {
    getAllUsers,
    deleteUser,
    getAllEbooks,
    publishEbook,
    deleteEbook,
    getEbookDetails,
    getGridFSFile,
} from "../controller/admin.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { uploadEbookFiles } from "../middleware/upload.middleware.js";

const router = Router();

// File streaming endpoint for GridFS (covers and digital assets)
// Open for viewing/downloading with authenticated admin access
router.get("/ebooks/files/:fileId", authMiddleware, getGridFSFile);

// Protect all remaining admin endpoints with both authentication and role verification
router.use(authMiddleware, isAdmin);

// User management routes
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// eBook management routes
router.get("/ebooks", getAllEbooks);
router.post("/ebooks", uploadEbookFiles, publishEbook);
router.get("/ebooks/:id", getEbookDetails);
router.delete("/ebooks/:id", deleteEbook);

export default router;
