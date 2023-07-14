import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth.js";

export const authRouter = express.Router();

authRouter.post("/api/user/signup", async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const existedUser = await User.findOne({ email });

		if (existedUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const cryptedPass = await bcrypt.hash(password, 10);

		const newUser = User({
			name,
			email,
			password: cryptedPass,
		});

		await newUser.save();

		return res.status(200).json(newUser);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

authRouter.post("/api/user/signin", async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: "User does not exist" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ error: "Password is incorrect" });
		}

		const token = jwt.sign({ id: user._id }, "SECRET_KEY");

		return res.status(200).json({ token, ...user._doc });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

authRouter.get("/api/user/token", async (req, res) => {
	try {
		const token = req.headers["x-auth-token"];

		if (!token) return res.json(false);

		const verified = jwt.verify(token, "SECRET_KEY");

		if (!verified) return res.json(false);

		const user = await User.findById(verified.id);
		if (!user) return res.json(false);

		return res.json(true);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

authRouter.get("/api/user/getData", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user);
		return res.json({ ...user._doc, token: req.token });
	} catch (e) {
		return res.status(500).json({ error: err.message });
	}
});
