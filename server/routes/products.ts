import { RequestHandler } from "express";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";

// GET all products
export const getAllProducts: RequestHandler = async (req, res) => {
  try {
    const products = await db("products").select("*");
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// GET single product
export const getProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await db("products").where({ id }).first();

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// POST create product
export const createProduct: RequestHandler = async (req, res) => {
  try {
    const {
      icon,
      name,
      subtitle,
      description,
      features,
      tech,
      image,
      price,
      status = "Active",
      category,
    } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Product name is required" });
    }

    const id = uuidv4();
    await db("products").insert({
      id,
      icon,
      name,
      subtitle,
      description,
      features,
      tech,
      image,
      price,
      status,
      category,
    });

    const newProduct = await db("products").where({ id }).first();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// PUT update product
export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      icon,
      name,
      subtitle,
      description,
      features,
      tech,
      image,
      price,
      status,
      category,
    } = req.body;

    const product = await db("products").where({ id }).first();
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    await db("products").where({ id }).update({
      ...(icon && { icon }),
      ...(name && { name }),
      ...(subtitle && { subtitle }),
      ...(description && { description }),
      ...(features && { features }),
      ...(tech && { tech }),
      ...(image && { image }),
      ...(price && { price }),
      ...(status && { status }),
      ...(category && { category }),
    });

    const updatedProduct = await db("products").where({ id }).first();
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// DELETE product
export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await db("products").where({ id }).first();
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    await db("products").where({ id }).delete();
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error instanceof Error ? error.message : error,
    });
  }
};
