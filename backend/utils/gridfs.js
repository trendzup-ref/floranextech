import mongoose from "mongoose";
import { Readable } from "stream";

let ebookBucket = null;

/**
 * Returns (and initializes if needed) the MongoDB GridFSBucket instance for eBooks.
 */
export const getEbookBucket = () => {
    if (!ebookBucket) {
        if (!mongoose.connection.db) {
            throw new Error("MongoDB connection not initialized");
        }
        ebookBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "ebooks_fs",
        });
    }
    return ebookBucket;
};

/**
 * Uploads a file buffer into MongoDB GridFS.
 *
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} filename - Original filename
 * @param {string} contentType - File MIME type
 * @param {Object} metadata - Custom metadata to attach to the GridFS file document
 * @returns {Promise<mongoose.Types.ObjectId>} - Resolves with the GridFS file _id
 */
export const uploadToGridFS = (buffer, filename, contentType, metadata = {}) => {
    return new Promise((resolve, reject) => {
        const bucket = getEbookBucket();
        const uploadStream = bucket.openUploadStream(filename, {
            contentType,
            metadata,
        });

        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);

        readableStream
            .pipe(uploadStream)
            .on("error", (error) => reject(error))
            .on("finish", () => resolve(uploadStream.id));
    });
};

/**
 * Deletes a file from MongoDB GridFS by its fileId.
 *
 * @param {mongoose.Types.ObjectId|string} fileId
 * @returns {Promise<boolean>}
 */
export const deleteFromGridFS = async (fileId) => {
    if (!fileId) return false;
    try {
        const bucket = getEbookBucket();
        const objectId = typeof fileId === "string" ? new mongoose.Types.ObjectId(fileId) : fileId;
        await bucket.delete(objectId);
        return true;
    } catch (error) {
        // If file does not exist in GridFS, log and treat gracefully
        console.warn(`GridFS delete warning for fileId ${fileId}:`, error.message);
        return false;
    }
};

/**
 * Streams a GridFS file to an Express response.
 *
 * @param {mongoose.Types.ObjectId|string} fileId
 * @param {import('express').Response} res
 * @param {boolean} download - Whether to prompt as attachment download
 */
export const streamGridFSFile = async (fileId, res, download = false) => {
    try {
        const bucket = getEbookBucket();
        const objectId = typeof fileId === "string" ? new mongoose.Types.ObjectId(fileId) : fileId;

        const files = await bucket.find({ _id: objectId }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ success: false, message: "File not found in storage" });
        }

        const file = files[0];
        res.setHeader("Content-Type", file.contentType || "application/octet-stream");
        res.setHeader("Content-Length", file.length);

        if (download) {
            res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
        } else {
            res.setHeader("Content-Disposition", `inline; filename="${file.filename}"`);
        }

        const downloadStream = bucket.openDownloadStream(objectId);
        downloadStream.on("error", (err) => {
            console.error("GridFS download stream error:", err);
            if (!res.headersSent) {
                res.status(500).json({ success: false, message: "Error reading file stream" });
            }
        });

        downloadStream.pipe(res);
    } catch (error) {
        console.error("Stream GridFS file error:", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Failed to stream file" });
        }
    }
};
