import mongoose from "mongoose";

let isConnected = false;

async function connectDB() {
    if (isConnected) {
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGODB URI is not defined in env");
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("Error connecting to database:", error);
        throw error;
    }
}

export default connectDB;
