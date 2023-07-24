import express from "express";
import { User } from "../models/user.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";
import { auth } from "../middleware/auth.js";

export const userRouter = express.Router();

userRouter.post("/api/add-to-cart", auth, async (req, res) => {
	try {
		const { id } = req.body;
		const product = await Product.findById(id);
		let user = await User.findById(req.user);

		const isFoundProduct = user.cart.find((item) =>
			item.product._id.equals(product._id)
		);
		if (isFoundProduct) {
			isFoundProduct.quantity += 1;
		} else {
			user.cart.push({
				product,
				quantity: 1,
			});
		}

		user = await user.save();
		return res.json(user);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

userRouter.delete("/api/remove-from-cart", auth, async (req, res) => {
	try {
		const { id } = req.body;
		const product = await Product.findById(id);
		let user = await User.findById(req.user);

		const productIndex = user.cart.findIndex((item) =>
			item.product._id.equals(product._id)
		);
		let foundProduct = user.cart[productIndex];
		if (foundProduct.quantity > 1) {
			foundProduct.quantity -= 1;
		} else {
			user.cart.splice(productIndex, 1);
		}

		user = await user.save();
		return res.json(user);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

userRouter.post("/api/save-user-address", auth, async (req, res) => {
	try {
		const { address } = req.body;
		let user = await User.findById(req.user);

		user.address = address;

		user = await user.save();

		return res.json(user);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

userRouter.post("/api/order", auth, async (req, res) => {
	try {
		const { cart, totalPrice, address } = req.body;
		let products = [];
		for (let i = 0; i < cart.length; i++) {
			const product = await Product.findById(cart[i].product._id);
			if (product.quantity >= cart[i].quantity) {
				product.quantity -= cart[i].quantity;
				products.push({ product, quantity: cart[i].quantity });
				await product.save();
			} else {
				return res
					.status(400)
					.json({ message: `${product.name} is out of stock` });
			}
		}
		let user = await User.findById(req.user);
		user.cart = [];
		user = user.save();

		let order = new Order({
			products,
			totalPrice,
			address,
			userId: req.user,
			orderedAt: Date.now(),
		});
		order = await order.save();

		return res.json(order);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});
userRouter.get("/api/orders/me", auth, async (req, res) => {
	try {
		const id = req.user;
		const orders = await Order.find({ userId: id });
		return res.json(orders);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});
