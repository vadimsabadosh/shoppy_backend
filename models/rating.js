import mongoose from "mongoose";

export const ratingSchema = mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
		required: true,
	},
});
