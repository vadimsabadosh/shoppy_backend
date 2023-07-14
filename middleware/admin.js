import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const isAdmin = async (req, res, next) => {
	try {
		const token = req.headers["x-auth-token"];
		if (!token)
			return res.status(401).json({ message: "User is not authenticated" });
		const verified = jwt.verify(token, "SECRET_KEY");

		if (!verified)
			return res.status(401).json({ message: "Token verification failed" });

		const user = await User.findById(verified.id);
		if (user.type !== "supplier") {
			return res.status(401).json({ message: "User does not have access" });
		}

		req.user = user;
		req.token = token;
		next();
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
};
