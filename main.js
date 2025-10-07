// /lib/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect("mongodb://localhost:27017/Vault", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected (local)");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default connectDB;
