import express from "express";
import 'dotenv/config';
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import authRoute from './routes/auth.route.js';
import productRoute from './routes/product.route.js';
import cartRoute from './routes/cart.route.js';
import couponRoute from './routes/coupon.route.js';
import paymentRoute from './routes/payment.route.js';
import analyticRoute from './routes/analytic.route.js';

const app = express();

const __dirname = path.resolve();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/coupon', couponRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/analytic', analyticRoute);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    });
}

const port = process.env.PORT || 1234;
connectDB();
app.listen(port, () => {
    console.log(`Server is running on port ${port}
Link: http://localhost:1234`);
})