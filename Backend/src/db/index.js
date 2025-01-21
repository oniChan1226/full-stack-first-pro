import mongoose from "mongoose"
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(connectionInstance.connection.host);
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
        throw new Error("Error connecting to the database");
    }
}