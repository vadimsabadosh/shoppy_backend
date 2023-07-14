import express from "express";
import { isAdmin } from "../middleware/admin.js";
import { Product } from "../models/product.js";

export const adminRouter = express.Router();

adminRouter.post("/admin/add-product", isAdmin, async (req, res) => {
	try {
		const { name, description, images, category, price, quantity } = req.body;
		let product = new Product({
			name,
			description,
			images,
			category,
			price,
			quantity,
		});
		product = await product.save();
		return res.json(product);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

adminRouter.get("/admin/get-products", isAdmin, async (req, res) => {
	try {
		const products = await Product.find({});
		return res.json(products);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});
adminRouter.get("/admin/get-product", isAdmin, async (req, res) => {
	try {
		const { id } = req.body;
		const product = await Product.findById(id);
		if (!product) {
			return res.status(400).json({ message: "Product does not exist" });
		}
		return res.json(product);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});
adminRouter.delete("/admin/delete-product", isAdmin, async (req, res) => {
	try {
		const { id } = req.body;
		let product = await Product.findByIdAndDelete(id);
		if (!product) {
			return res.status(400).json({ message: "Product does not exist" });
		}
		return res.json(product);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});
