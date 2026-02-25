import "dotenv/config";
import express from "express";
import cors from "cors";
import { db, getSetting, updateSetting } from "./db";
import { AuthResponse, DashboardSummary } from "@shared/api";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Auth
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    // In a real app, use password hashing
    const user = db.users.find((u) => u.username === username && password === "admin");
    if (user) {
      res.json({ user, token: "mock-token" } as AuthResponse);
    } else {
      res.status(401).json({ user: null, message: "Invalid credentials" } as AuthResponse);
    }
  });

  // Dashboard
  app.get("/api/dashboard-summary", (_req, res) => {
    const summary: DashboardSummary = {
      totalUsers: db.users.length,
      totalProducts: db.products.length,
      totalMessages: db.messages.length,
    };
    res.json(summary);
  });

  // Settings
  app.get("/api/settings", (_req, res) => {
    res.json(db.settings);
  });

  app.post("/api/settings", (req, res) => {
    const settings = req.body; // Expecting array of {key, value}
    if (Array.isArray(settings)) {
      settings.forEach((s) => updateSetting(s.key, s.value));
    } else if (settings.key && settings.value) {
      updateSetting(settings.key, settings.value);
    }
    res.json({ success: true });
  });

  app.delete("/api/settings/:key", (req, res) => {
    const key = req.params.key;
    db.settings = db.settings.filter((s) => s.key !== key);
    res.json({ success: true });
  });

  // Products
  app.get("/api/products", (_req, res) => {
    res.json(db.products);
  });

  app.post("/api/products", (req, res) => {
    const product = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
    db.products.push(product);
    res.json(product);
  });

  app.put("/api/products/:id", (req, res) => {
    const index = db.products.findIndex((p) => p.id === req.params.id);
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...req.body };
      res.json(db.products[index]);
    } else {
      res.status(404).send();
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    db.products = db.products.filter((p) => p.id !== req.params.id);
    res.json({ success: true });
  });

  // Users
  app.get("/api/users", (_req, res) => {
    res.json(db.users);
  });

  app.post("/api/users", (req, res) => {
    const user = { ...req.body, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    db.users.push(user);
    res.json(user);
  });

  app.delete("/api/users/:id", (req, res) => {
    db.users = db.users.filter((u) => u.id !== req.params.id);
    res.json({ success: true });
  });

  // Contact Messages
  app.get("/api/messages", (_req, res) => {
    res.json(db.messages);
  });

  app.post("/api/messages", (req, res) => {
    const message = { ...req.body, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString() };
    db.messages.push(message);
    res.json(message);
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  return app;
}
