import { Router } from "express";
import {
    getPublicEbooks,
    getPublicEbookBySlug,
    getPublicGridFSFile,
} from "../controller/ebook.controller.js";
import { optionalAuthMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Public route to fetch all published eBooks
router.get("/", getPublicEbooks);

// Public route to stream cover image from GridFS
router.get("/files/:fileId", getPublicGridFSFile);

// Public route to get eBook details by its unique slug (with optional auth for purchase recognition)
router.get("/:slug", optionalAuthMiddleware, getPublicEbookBySlug);

export default router;
