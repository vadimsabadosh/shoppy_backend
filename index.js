import express from "express";
import mongoose from "mongoose";

import { authRouter } from "./routes/auth.js";
import { adminRouter } from "./routes/admin.js";
import { productRouter } from "./routes/product.js";
import { userRouter } from "./routes/user.js";

const PORT = 3000;
const DB =
	"mongodb+srv://kviklyccc:123123123Admin@shoppydb.sjzujr5.mongodb.net/shoppy?retryWrites=true&w=majority";
const app = express();
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

app.get("/", (req, res) => {
	res.json({ message: "ok" });
});

mongoose
	.connect(DB)
	.then(() => {
		console.log("Connected to DB");
	})
	.catch((e) => {
		console.log(e);
	});

app.listen(PORT, "0.0.0.0", () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
