import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
	try {
		const token = req.headers["x-auth-token"];
		if (!token)
			return res.status(401).json({ message: "User is not authenticated" });
		const verified = jwt.verify(token, "SECRET_KEY");

		if (!verified)
			return res.status(401).json({ message: "Token verification failed" });

		req.user = verified.id;
		req.token = token;
		next();
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
};
