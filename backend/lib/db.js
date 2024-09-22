import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.log(`Error connecting to MongoDB`, error.message);
        process.exit(1)
    }
}