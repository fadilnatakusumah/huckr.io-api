import { connect } from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  console.log("Connecting to database...");
  try {
    await connect(process.env.MONGODB_URL!);
    console.log("Database connected");
  } catch (error) {
    console.error("Failed to connect to database", error);
  }
};
