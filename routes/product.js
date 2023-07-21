import express from "express";
import { Product } from "../models/product.js";
import { auth } from "../middleware/auth.js";

export const productRouter = express.Router();

productRouter.get("/api/products", auth, async (req, res) => {
	try {
		const category = req.query.category;
		const products = await Product.find({ category: category });
		return res.json(products);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

productRouter.get("/api/products/search/:query", auth, async (req, res) => {
	try {
		const query = req.params.query;
		const products = await Product.find({
			name: { $regex: query, $options: "i" },
		});
		return res.json(products);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

productRouter.post("/api/rate-product", auth, async (req, res) => {
	try {
		const { id, rating } = req.body;
		let product = await Product.findById(id);
		for (let i = 0; i < product.ratings.length; i++) {
			if (product.ratings[i].userId === req.user) {
				product.ratings.splice(i, 1);
				break;
			}
		}

		const ratingSchema = {
			userId: req.user,
			rating: rating,
		};
		product.ratings.push(ratingSchema);
		await product.save();
		return res.json(product);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

productRouter.get("/api/deal-of-the-day", auth, async (req, res) => {
	try {
		let products = await Product.find({});

		products = products.sort((a, b) => {
			let aSum,
				bSum = 0;

			for (let i = 0; i < a.ratings.length; i++) {
				aSum += a.ratings[i].rating;
			}
			for (let i = 0; i < b.ratings.length; i++) {
				bSum += b.ratings[i].rating;
			}

			return aSum < bSum ? 1 : -1;
		});

		return res.json(products[0]);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});
