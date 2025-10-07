import mongoose from "mongoose";

const VaultSchema = new mongoose.Schema({
  title: String,
  username: String,
  password: String,
  url: String,
  notes: String,
  userId: { type: String, required: true },
});

export default mongoose.models.Vault || mongoose.model("Vault", VaultSchema);
