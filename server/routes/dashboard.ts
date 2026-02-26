import { RequestHandler } from "express";
import { db } from "../db";

export const getDashboardSummary: RequestHandler = async (req, res) => {
  try {
    const totalUsers = await db("users").count("id as count").first();
    const totalProducts = await db("products").count("id as count").first();
    const totalMessages = await db("messages").count("id as count").first();

    res.status(200).json({
      success: true,
      data: {
        totalUsers: Number(totalUsers?.count || 0),
        totalProducts: Number(totalProducts?.count || 0),
        totalMessages: Number(totalMessages?.count || 0),
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
      error: error instanceof Error ? error.message : error,
    });
  }
};
