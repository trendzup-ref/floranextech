import multer from "multer";

// Configure multer to store uploaded files in memory as Buffers
// so they can be streamed directly into MongoDB GridFS.
const storage = multer.memoryStorage();

// File filter for allowed eBook covers and digital assets
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "coverImage") {
        if (file.mimetype.startsWith("image/")) {
            return cb(null, true);
        }
        return cb(new Error("Cover image must be a valid image file (jpeg, png, webp, etc.)"), false);
    }

    if (file.fieldname === "digitalFile") {
        const allowedTypes = [
            "application/pdf",
            "application/epub+zip",
            "application/zip",
            "application/x-zip-compressed",
            "application/octet-stream",
        ];
        const ext = file.originalname.toLowerCase();
        if (
            allowedTypes.includes(file.mimetype) ||
            ext.endsWith(".pdf") ||
            ext.endsWith(".epub") ||
            ext.endsWith(".zip")
        ) {
            return cb(null, true);
        }
        return cb(new Error("Digital file must be a PDF, EPUB, or ZIP asset."), false);
    }

    // Default allow for other fields if needed
    cb(null, true);
};

export const uploadEbookFiles = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max file size
    },
    fileFilter,
}).fields([
    { name: "coverImage", maxCount: 1 },
    { name: "digitalFile", maxCount: 1 },
]);

export default uploadEbookFiles;
