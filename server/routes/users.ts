import { RequestHandler } from "express";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";

// GET all users
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await db("users").select("*");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// GET single user
export const getUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db("users").where({ id }).first();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// POST create user
export const createUser: RequestHandler = async (req, res) => {
  try {
    const { username, password, role = "user" } = req.body;

    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const id = uuidv4();
    await db("users").insert({
      id,
      username,
      password,
      role,
    });

    const newUser = await db("users").where({ id }).first();
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// PUT update user
export const updateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;

    const user = await db("users").where({ id }).first();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await db("users").where({ id }).update({
      ...(username && { username }),
      ...(password && { password }),
      ...(role && { role }),
    });

    const updatedUser = await db("users").where({ id }).first();
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// DELETE user
export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db("users").where({ id }).first();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await db("users").where({ id }).delete();
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error instanceof Error ? error.message : error,
    });
  }
};
