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
    const settings = Array.isArray(req.body) ? req.body : [req.body];

    for (const item of settings) {
      const { key, value, page_name = "global" } = item;

      if (!key) continue;

      const existing = await db("settings").where({ key }).first();

      if (existing) {
        await db("settings").where({ key }).update({ value, page_name });
      } else {
        await db("settings").insert({ key, value, page_name });
      }
    }

    const allSettings = await db("settings").select("*");
    res.status(200).json({ success: true, data: allSettings });
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
    const { value, page_name, key } = req.body;

    const setting = await db("settings").where({ id }).first();
    if (!setting) {
      return res
        .status(404)
        .json({ success: false, message: "Setting not found" });
    }

    const updateData: any = {};
    if (value !== undefined) updateData.value = value;
    if (page_name !== undefined) updateData.page_name = page_name;
    if (key !== undefined) updateData.key = key;

    await db("settings").where({ id }).update(updateData);

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
