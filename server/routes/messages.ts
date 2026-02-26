import { RequestHandler } from "express";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";

// GET all messages
export const getAllMessages: RequestHandler = async (req, res) => {
  try {
    const messages = await db("messages").select("*");
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// GET single message
export const getMessage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await db("messages").where({ id }).first();

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch message",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// POST create message
export const createMessage: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    const id = uuidv4();
    await db("messages").insert({
      id,
      name,
      email,
      phone,
      message,
    });

    const newMessage = await db("messages").where({ id }).first();
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create message",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// PUT update message
export const updateMessage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, message } = req.body;

    const existingMessage = await db("messages").where({ id }).first();
    if (!existingMessage) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    await db("messages").where({ id }).update({
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(message && { message }),
    });

    const updatedMessage = await db("messages").where({ id }).first();
    res.status(200).json({ success: true, data: updatedMessage });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// DELETE message
export const deleteMessage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await db("messages").where({ id }).first();
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    await db("messages").where({ id }).delete();
    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error instanceof Error ? error.message : error,
    });
  }
};
