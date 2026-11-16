import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { EBook } from "../models/eBook.model.js";
import { generateSlug } from "../utils/generateSlug.js";
import { uploadToGridFS, deleteFromGridFS, streamGridFSFile } from "../utils/gridfs.js";

export const getAllUsers = async (req, res) => {
    try {
        // Extract pagination query params 
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Optional: Search filter (searches name or email case-insensitively)
        const search = req.query.search || '';
        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const [users, totalUsers] = await Promise.all([
            User.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(query)
        ]);

        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users,
            pagination: {
                totalUsers,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error("Error while fetching all users:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching all users"
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user && req.user.id.toString() === id) {
            return res.status(400).json({
                success: false,
                message: "Action forbidden: You cannot delete your own admin account while logged in."
            });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Error while deleting user:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the user"
        });
    }
};

export const publishEbook = async (req, res) => {
    let uploadedCoverId = null;
    let uploadedFileId = null;

    try {
        const {
            title,
            slug,
            description,
            price,
            category = "eBook",
            isPublished = true,
        } = req.body;

        if (!title || !description || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: title, description, and price."
            });
        }

        const coverImageFile = req.files?.coverImage?.[0];
        const digitalAssetFile = req.files?.digitalFile?.[0];

        let coverImageData = {
            fileId: null,
            filename: '',
            contentType: 'image/jpeg',
            url: '',
        };

        let digitalFileData = {
            fileId: null,
            filename: '',
            contentType: 'application/pdf',
            fileType: 'pdf',
            fileSize: 0,
            url: '',
        };

        // 1. Process Cover Image
        if (coverImageFile) {
            uploadedCoverId = await uploadToGridFS(
                coverImageFile.buffer,
                coverImageFile.originalname,
                coverImageFile.mimetype,
                { type: "coverImage", uploadedBy: req.user?.id }
            );

            coverImageData = {
                fileId: uploadedCoverId,
                filename: coverImageFile.originalname,
                contentType: coverImageFile.mimetype,
                url: `/api/admin/ebooks/files/${uploadedCoverId}`,
            };
        } else if (req.body.coverImage) {
            // Fallback for JSON body or raw URLs
            const parsedCover = typeof req.body.coverImage === 'string'
                ? JSON.parse(req.body.coverImage)
                : req.body.coverImage;

            coverImageData = {
                fileId: parsedCover.fileId || null,
                filename: parsedCover.filename || '',
                contentType: parsedCover.contentType || 'image/jpeg',
                url: parsedCover.url || (parsedCover.fileId ? `/api/admin/ebooks/files/${parsedCover.fileId}` : ''),
            };
        } else if (req.body.coverImageUrl) {
            coverImageData = {
                fileId: null,
                filename: 'cover',
                contentType: 'image/jpeg',
                url: req.body.coverImageUrl,
            };
        } else {
            return res.status(400).json({
                success: false,
                message: "Cover image file or coverImageUrl is required."
            });
        }

        // 2. Process Digital Asset File (stored in GridFS)
        if (digitalAssetFile) {
            uploadedFileId = await uploadToGridFS(
                digitalAssetFile.buffer,
                digitalAssetFile.originalname,
                digitalAssetFile.mimetype,
                { type: "digitalFile", uploadedBy: req.user?.id }
            );

            let detectedType = "pdf";
            const ext = digitalAssetFile.originalname.toLowerCase();
            if (ext.endsWith(".epub")) detectedType = "epub";
            else if (ext.endsWith(".zip")) detectedType = "zip";

            digitalFileData = {
                fileId: uploadedFileId,
                filename: digitalAssetFile.originalname,
                contentType: digitalAssetFile.mimetype,
                fileType: req.body.fileType || detectedType,
                fileSize: digitalAssetFile.size,
                url: `/api/admin/ebooks/files/${uploadedFileId}?download=true`,
            };
        } else if (req.body.digitalFile) {
            const parsedFile = typeof req.body.digitalFile === 'string'
                ? JSON.parse(req.body.digitalFile)
                : req.body.digitalFile;

            digitalFileData = {
                fileId: parsedFile.fileId || null,
                filename: parsedFile.filename || '',
                contentType: parsedFile.contentType || 'application/pdf',
                fileType: parsedFile.fileType || 'pdf',
                fileSize: parsedFile.fileSize || 0,
                url: parsedFile.url || (parsedFile.fileId ? `/api/admin/ebooks/files/${parsedFile.fileId}?download=true` : ''),
            };
        } else if (req.body.digitalFileUrl) {
            digitalFileData = {
                fileId: null,
                filename: 'digital-file',
                contentType: 'application/pdf',
                fileType: req.body.fileType || 'pdf',
                fileSize: 0,
                url: req.body.digitalFileUrl,
            };
        } else {
            return res.status(400).json({
                success: false,
                message: "Digital file asset or digitalFileUrl is required."
            });
        }

        // Generate or normalize slug
        let finalSlug = slug ? generateSlug(slug) : generateSlug(title);

        // Ensure unique slug
        let slugExists = await EBook.findOne({ slug: finalSlug });
        if (slugExists) {
            finalSlug = `${finalSlug}-${Date.now()}`;
        }

        const newEbook = await EBook.create({
            title: title.trim(),
            slug: finalSlug,
            description: description.trim(),
            price: Number(price),
            category,
            coverImage: coverImageData,
            digitalFile: digitalFileData,
            isPublished: Boolean(isPublished),
        });

        return res.status(201).json({
            success: true,
            message: "eBook published successfully into GridFS",
            ebook: newEbook
        });
    } catch (error) {
        console.error("Error while publishing ebook:", error);

        // Clean up newly uploaded files from GridFS if document creation failed
        if (uploadedCoverId) await deleteFromGridFS(uploadedCoverId);
        if (uploadedFileId) await deleteFromGridFS(uploadedFileId);

        if (error.name === "ValidationError") {
            const firstError = Object.values(error.errors)[0]?.message;
            return res.status(400).json({
                success: false,
                message: firstError || "Validation error"
            });
        }

        return res.status(500).json({
            success: false,
            message: "An error occurred while publishing ebook"
        });
    }
};


export const deleteEbook = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid eBook ID format"
            });
        }

        const ebook = await EBook.findById(id);

        if (!ebook) {
            return res.status(404).json({
                success: false,
                message: "eBook not found"
            });
        }

        // Remove files from GridFS if stored as GridFS fileIds
        if (ebook.coverImage?.fileId) {
            await deleteFromGridFS(ebook.coverImage.fileId);
        }
        if (ebook.digitalFile?.fileId) {
            await deleteFromGridFS(ebook.digitalFile.fileId);
        }

        await EBook.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "eBook and all associated GridFS assets deleted successfully",
            deletedId: id
        });
    } catch (error) {
        console.error("Error while deleting ebook:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the ebook"
        });
    }
};

export const getAllEbooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search || '';
        const query = search
            ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { slug: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const [ebooks, totalEbooks] = await Promise.all([
            EBook.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            EBook.countDocuments(query)
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
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error("Error while fetching ebooks:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching ebooks"
        });
    }
};

export const getEbookDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if querying by MongoDB ObjectId or by unique slug
        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query = isObjectId ? { _id: id } : { slug: id.toLowerCase() };

        const ebook = await EBook.findOne(query);

        if (!ebook) {
            return res.status(404).json({
                success: false,
                message: "eBook not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "eBook details fetched successfully",
            ebook
        });
    } catch (error) {
        console.error("Error while fetching ebook details:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching ebook details"
        });
    }
};

export const getGridFSFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const download = req.query.download === "true";

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ success: false, message: "Invalid file ID" });
        }

        await streamGridFSFile(fileId, res, download);
    } catch (error) {
        console.error("Error getting GridFS file:", error);
        return res.status(500).json({ success: false, message: "Error retrieving file from GridFS" });
    }
};
