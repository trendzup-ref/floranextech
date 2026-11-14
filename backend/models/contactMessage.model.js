import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: [2, "name must be atleast 2 characters"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        lowercase: true,
        trim: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email"],
        maxlength: [100, "email must be shorter than 100 characters"]
    },
    subject: {
        type: String,
        required: [true, "subject is required"],
        minLength: [2, "subject must be more than 2 characters"],
        maxlength: [200, "subject cannot be more than 200 characters"]
    },
    message: {
        type: String,
        required: [true, "message is required"],
        minLength: [2, "message must be more than 2 characters"],
        maxlength: [1000, "message cannot be more than 1000 characters"]
    },

}, {
    timestamps: true
})

export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);


