import mongoose from "mongoose";
import { ratingSchema } from "./rating.js";

export const productSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		images: [
			{
				type: String,
				required: true,
			},
		],
		quantity: {
			type: Number,
			required: true,
			trim: true,
		},
		price: {
			type: Number,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},
		ratings: [ratingSchema],
	},
	{ timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
