import { RequestHandler } from "express";
import { db } from "../db";

export const handleInitDB: RequestHandler = async (req, res) => {
  try {
    // Create users table
    await db.schema.createTableIfNotExists("users", (table) => {
      table.string("id", 36).primary();
      table.string("username", 255).notNullable().unique();
      table.string("password", 255);
      table.enum("role", ["admin", "user"]).notNullable().defaultTo("user");
      table.timestamp("createdAt").defaultTo(db.fn.now());
    });

    // Create products table
    await db.schema.createTableIfNotExists("products", (table) => {
      table.string("id", 36).primary();
      table.string("icon", 255);
      table.string("name", 255).notNullable();
      table.string("subtitle", 255);
      table.text("description");
      table.text("features");
      table.string("tech", 255);
      table.string("image", 255);
      table.decimal("price", 10, 2);
      table.enum("status", ["Active", "Inactive", "Draft"]).defaultTo("Active");
      table.string("category", 255);
      table.timestamp("dateAdded").defaultTo(db.fn.now());
    });

    // Create messages table
    await db.schema.createTableIfNotExists("messages", (table) => {
      table.string("id", 36).primary();
      table.string("name", 255).notNullable();
      table.string("email", 255).notNullable();
      table.string("phone", 20);
      table.text("message").notNullable();
      table.timestamp("date").defaultTo(db.fn.now());
    });

    // Create settings table
    await db.schema.createTableIfNotExists("settings", (table) => {
      table.increments("id").primary();
      table.string("key", 255).notNullable().unique();
      table.text("value");
      table
        .timestamp("updatedAt")
        .defaultTo(db.fn.now())
        .onUpdate(db.fn.now());
    });

    res.status(200).json({
      success: true,
      message: "Database tables initialized successfully",
    });
  } catch (error) {
    console.error("Database initialization error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initialize database",
      error: error instanceof Error ? error.message : error,
    });
  }
};
