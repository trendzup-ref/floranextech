import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        minlength: [2, "name must be atleast 2 characters long"],
        maxlength: [70, "name must be less than 100 characters"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email"],
        maxlength: [100, "email must be shorter than 100 characters"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [8, "password must be atleast 8 characters long"],
        maxlength: [100, "password must be less than 100 characters"],
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: [true, "role is required"],
        default: 'user'
    },
}, {
    timestamps: true
})

export const User = mongoose.model("User", userSchema);


