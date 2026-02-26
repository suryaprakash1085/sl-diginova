import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db, connectDB } from "./db";
import { handleInitDB } from "./routes/init";
import { handleLogin } from "./routes/auth";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "./routes/users";
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./routes/products";
import {
  getAllMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
} from "./routes/messages";
import {
  getAllSettings,
  getSetting,
  setSetting,
  updateSetting,
  deleteSetting,
} from "./routes/settings";
import { getDashboardSummary } from "./routes/dashboard";
import { handleFileUpload } from "./routes/upload";

dotenv.config();

export function createServer() {
  const app = express();

  // Connect DB once when server starts
  connectDB();

  // ================= MIDDLEWARE =================
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ================= STATIC FILES =================
  app.use("/uploads", express.static("public/uploads"));

  // ================= INITIALIZATION ROUTES =================
  app.post("/api/init-db", handleInitDB);

  // ================= AUTHENTICATION ROUTES =================
  app.post("/api/login", handleLogin);

  // ================= USERS ROUTES =================
  app.get("/api/users", getAllUsers);
  app.get("/api/users/:id", getUser);
  app.post("/api/users", createUser);
  app.put("/api/users/:id", updateUser);
  app.delete("/api/users/:id", deleteUser);

  // ================= PRODUCTS ROUTES =================
  app.get("/api/products", getAllProducts);
  app.get("/api/products/:id", getProduct);
  app.post("/api/products", createProduct);
  app.put("/api/products/:id", updateProduct);
  app.delete("/api/products/:id", deleteProduct);

  // ================= MESSAGES ROUTES =================
  app.get("/api/messages", getAllMessages);
  app.get("/api/messages/:id", getMessage);
  app.post("/api/messages", createMessage);
  app.put("/api/messages/:id", updateMessage);
  app.delete("/api/messages/:id", deleteMessage);

  // ================= SETTINGS ROUTES =================
  app.get("/api/settings", getAllSettings);
  app.get("/api/settings/:key", getSetting);
  app.post("/api/settings", setSetting);
  app.put("/api/settings/:id", updateSetting);
  app.delete("/api/settings/:id", deleteSetting);

  // ================= DASHBOARD ROUTES =================
  app.get("/api/dashboard-summary", getDashboardSummary);

  // ================= UPLOAD ROUTES =================
  app.post("/api/upload", handleFileUpload);

  // ================= HEALTH CHECK =================
  app.get("/api/health", (req, res) => {
    res.json({ status: "🚀 Server is running successfully" });
  });

  return app;
}

const PORT = process.env.PORT || 9005;
const app = createServer();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
