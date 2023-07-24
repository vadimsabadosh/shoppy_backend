import express from "express";
import { isAdmin } from "../middleware/admin.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";

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

adminRouter.patch("/admin/change-order-status", isAdmin, async (req, res) => {
	try {
		const { id, status } = req.body;
		let order = await Order.findById(id);

		if (!order) {
			return res.status(400).json({ message: "Product does not exist" });
		}
		order.status = status;
		order = await order.save();
		return res.json(order);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

adminRouter.get("/admin/get-orders", isAdmin, async (req, res) => {
	try {
		const orders = await Order.find({});
		return res.json(orders);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

adminRouter.get("/admin/analytics", isAdmin, async (req, res) => {
	try {
		const orders = await Order.find({});
		let totalEarnings = 0;

		for (let i = 0; i < orders.length; i++) {
			for (let j = 0; j < orders[i].products.length; j++) {
				totalEarnings +=
					orders[i].products[j].product.price * orders[i].products[j].quantity;
			}
		}

		let mobilesEarnings = await fetchCategoryWiseProduct("Mobiles");
		let essentialsEarnings = await fetchCategoryWiseProduct("Essentials");
		let appliancesEarnings = await fetchCategoryWiseProduct("Appliances");
		let booksEarnings = await fetchCategoryWiseProduct("Books");
		let fashionEarnings = await fetchCategoryWiseProduct("Fashion");
		let earnings = {
			totalEarnings,
			mobilesEarnings,
			essentialsEarnings,
			appliancesEarnings,
			booksEarnings,
			fashionEarnings,
		};
		return res.json(earnings);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

async function fetchCategoryWiseProduct(category) {
	let earnings = 0;
	let categoryOrders = await Order.find({
		"products.product.category": category,
	});

	for (let i = 0; i < categoryOrders.length; i++) {
		for (let j = 0; j < categoryOrders[i].products.length; j++) {
			earnings +=
				categoryOrders[i].products[j].product.price *
				categoryOrders[i].products[j].quantity;
		}
	}
	return earnings;
}
