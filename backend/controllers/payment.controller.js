import { stripe } from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

const createStripeCoupon = async (discountPercentage) => {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: 'once',
    })
    return coupon.id;
}
const createNewCoupon = async (userId) => {
    await Coupon.findOneAndDelete({ userId })
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        userId,
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
    })
    await newCoupon.save();
    return newCoupon;
}
export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;
        const userId = String(req.user._id);
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array" });
        }
        let totalAmount = 0;
        const lineItems = products.map(product => {
            const amount = Math.round(product.price * 100);
            totalAmount += amount * product.quantity;
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        images: [product.image]
                    },
                    unit_amount: amount
                },
                quantity: product.quantity || 1
            }
        })
        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, userId, isActive: true });
            if (coupon) {
                totalAmount -= Math.round(totalAmount * coupon.discountPercentage / 100);
            }
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/purchase-cancel`,
            discounts: coupon ? [
                {
                    coupon: await createStripeCoupon(coupon.discountPercentage),
                }
            ] : [],
            metadata: {
                userId,
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map(p => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price
                    }))
                )
            }
        });

        if (totalAmount >= 20000) { // >= $200
            await createNewCoupon(userId);
        }
        res.status(200).json({
            id: session.id,
            totalAmount: totalAmount / 100,
        })
    } catch (error) {
        console.log("Error in createCheckoutSession controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message })
    }
}
export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate({
                    code: session.metadata.couponCode,
                    userId: session.metadata.userId
                }, { isActive: false });
            }
            // create a new order
            const checkSessionId = await Order.findOne({ stripeSessionId: sessionId })
            if (checkSessionId) {
                return res.status(200).json({ message: "Payment successful, order created, and coupon deactivated if used." });
            }

            const products = JSON.parse(session.metadata.products)
            const newOrder = new Order({
                userId: session.metadata.userId,
                products: products.map(p => ({
                    product: p.id,
                    quantity: p.quantity,
                    price: p.price
                })),
                totalAmount: session.amount_total / 100,
                stripeSessionId: sessionId
            })
            await newOrder.save();
            res.status(200).json({ message: "Payment successful, order created, and coupon deactivated if used." })
        }
    } catch (error) {
        console.log("Error in checkoutSuccess controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message })
    }
}