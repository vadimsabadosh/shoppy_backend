import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			validate: {
				validator: function (email) {
					const regx = new RegExp(
						/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
					);
					return email.match(regx);
				},
				message: "Email is not valid. Please try again",
			},
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
			validate: {
				validator: function (password) {
					return password.length > 6;
				},
				message: "Password must be at least 7 characters long",
			},
		},
		address: {
			type: String,
			default: "",
		},
		type: {
			type: String,
			enum: ["customer", "supplier"],
			default: "customer",
		},
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
