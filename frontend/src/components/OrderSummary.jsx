import { motion } from "framer-motion"
import useCartStore from "../store/useCartStore"
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js"
import axios from "../lib/axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
const OrderSummary = () => {
    const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
    let savings = subtotal - total;
    const formattedSubtotal = Number(subtotal).toFixed(2);
    const formattedTotal = Number(total).toFixed(2);
    const formattedSavings = Number(savings).toFixed(2);
    const handlePayment = async () => {
        const stripe = await stripePromise;
        const res = await axios.post("/payment/create-checkout-session", {
            products: cart, couponCode: coupon ? coupon.code : null
        })
        const session = res.data;
        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        })
        if (result.error) {
            console.error("Error:", result.error);
        }
    }
    return (
        <motion.div
            className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <p className="text-xl font-semibold text-emerald-400">Order Summary</p>
            <div className="space-y-4">
                <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-300">Original price</dt>
                        <dt className="text-base font-medium text-white">${formattedSubtotal}</dt>
                    </dl>

                    {
                        savings > 0 &&
                        <dl className="flex items-center justify-between gap-4">
                            <dt className="text-base font-normal text-gray-300">Savings</dt>
                            <dt className="text-base font-medium text-white">${formattedSavings}</dt>
                        </dl>
                    }
                    {
                        coupon && isCouponApplied &&
                        <dl className="flex items-center justify-between gap-4">
                            <dt className="text-base font-normal text-gray-300">Coupon {coupon.code}</dt>
                            <dt className="text-base font-medium text-emerald-400">-{coupon.discountPercentage}%</dt>
                        </dl>
                    }
                    <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
                        <dt className="text-base font-normal text-gray-300">Total</dt>
                        <dt className="text-base font-medium text-emerald-400">${formattedTotal}</dt>
                    </dl>
                </div>
                <motion.button
                    className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePayment}
                >
                    Proceed to Checkout
                </motion.button>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-normal text-gray-400">or</span>
                    <Link
                        to={"/"}
                        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
                    >Continue Shopping <MoveRight size={16} /></Link>
                </div>
            </div>
        </motion.div>
    )
}

export default OrderSummary