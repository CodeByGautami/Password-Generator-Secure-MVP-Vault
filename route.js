//import { connectDB } from "../../../lib/db.js";
//import { Vault } from "../../../models/Vault.js";
import connectDB from "../../../lib/db.js";
import Vault from "@/models/Vault.js";

import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const SECRET_KEY = "your-secret-key";

async function getUserId(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(req) {
  await connectDB();
  const userId = await getUserId(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const data = await req.json();
  const encryptedPassword = CryptoJS.AES.encrypt(data.password, SECRET_KEY).toString();

  try {
    const newItem = await Vault.create({ ...data, password: encryptedPassword, userId });
    return new Response(JSON.stringify(newItem), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to save vault", { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();
  const userId = await getUserId(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const items = await Vault.find({ userId });
    const decryptedItems = items.map((item) => ({
      ...item._doc,
      password: CryptoJS.AES.decrypt(item.password, SECRET_KEY).toString(CryptoJS.enc.Utf8),
    }));
    return new Response(JSON.stringify(decryptedItems), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to fetch vault items", { status: 500 });
  }
}

export async function PUT(req) {
  await connectDB();
  const userId = await getUserId(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const data = await req.json();
  try {
    const updated = await Vault.findOneAndUpdate(
      { _id: data._id, userId },
      { ...data, password: CryptoJS.AES.encrypt(data.password, SECRET_KEY).toString() },
      { new: true }
    );
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to update vault item", { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  const userId = await getUserId(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const data = await req.json();
  try {
    await Vault.findOneAndDelete({ _id: data._id, userId });
    return new Response("Deleted", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to delete vault item", { status: 500 });
  }
}
