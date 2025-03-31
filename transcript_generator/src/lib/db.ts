import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Mongo URI is missing");
  }
  try {
    const connect = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.error("Error connecting mongodb", error);
    process.exit();
  }
};
