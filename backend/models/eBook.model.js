import mongoose from 'mongoose';

const ebookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide an eBook title'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
            maxlength: [3000, 'Description cannot exceed 3000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide a price'],
            min: [0, 'Price cannot be negative'],
        },
        category: {
            type: String,
            required: true,
            enum: ['eBook', 'Template', 'Guide', 'Bundle'],
            default: 'eBook',
        },

        // Cover Image stored in MongoDB GridFS or external URL
        coverImage: {
            fileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ebooks_fs.files',
                default: null,
            },
            filename: {
                type: String,
                default: '',
            },
            contentType: {
                type: String,
                default: 'image/jpeg',
            },
            url: {
                type: String,
                default: '',
            },
        },

        // Digital asset stored in MongoDB GridFS
        digitalFile: {
            fileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ebooks_fs.files',
                default: null,
            },
            filename: {
                type: String,
                default: '',
            },
            contentType: {
                type: String,
                default: 'application/pdf',
            },
            fileType: {
                type: String,
                enum: ['pdf', 'zip', 'epub'],
                default: 'pdf',
            },
            fileSize: {
                type: Number,
                default: 0,
            },
            url: {
                type: String,
                default: '',
            },
        },

        isPublished: {
            type: Boolean,
            default: true,
            index: true,
        },
        salesCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for fast storefront filtering & admin search
ebookSchema.index({ title: 'text', description: 'text' });
ebookSchema.index({ category: 1, isPublished: 1 });

export const EBook = mongoose.model('Ebook', ebookSchema);
export default EBook;
