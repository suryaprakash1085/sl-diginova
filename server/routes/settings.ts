import { RequestHandler } from "express";
import { db } from "../db";

// GET all settings
export const getAllSettings: RequestHandler = async (req, res) => {
  try {
    const settings = await db("settings").select("*");
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// GET single setting
export const getSetting: RequestHandler = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await db("settings").where({ key }).first();

    if (!setting) {
      return res
        .status(404)
        .json({ success: false, message: "Setting not found" });
    }

    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    console.error("Error fetching setting:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch setting",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// POST create or update setting
export const setSetting: RequestHandler = async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key) {
      return res
        .status(400)
        .json({ success: false, message: "Setting key is required" });
    }

    const existing = await db("settings").where({ key }).first();

    if (existing) {
      await db("settings").where({ key }).update({ value });
    } else {
      await db("settings").insert({ key, value });
    }

    const setting = await db("settings").where({ key }).first();
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    console.error("Error setting value:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set setting",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// PUT update setting
export const updateSetting: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    const setting = await db("settings").where({ id }).first();
    if (!setting) {
      return res
        .status(404)
        .json({ success: false, message: "Setting not found" });
    }

    await db("settings").where({ id }).update({ value });

    const updatedSetting = await db("settings").where({ id }).first();
    res.status(200).json({ success: true, data: updatedSetting });
  } catch (error) {
    console.error("Error updating setting:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update setting",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// DELETE setting
export const deleteSetting: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const setting = await db("settings").where({ id }).first();
    if (!setting) {
      return res
        .status(404)
        .json({ success: false, message: "Setting not found" });
    }

    await db("settings").where({ id }).delete();
    res
      .status(200)
      .json({ success: true, message: "Setting deleted successfully" });
  } catch (error) {
    console.error("Error deleting setting:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete setting",
      error: error instanceof Error ? error.message : error,
    });
  }
};
