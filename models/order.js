import mongoose from "mongoose";
import { productSchema } from "./product.js";

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	products: [
		{
			product: productSchema,
			quantity: {
				type: Number,
				required: true,
			},
		},
	],
	totalPrice: {
		type: Number,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	orderedAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
	status: {
		type: Number,
		default: 0,
		required: true,
	},
});

export const Order = mongoose.model("Order", orderSchema);
