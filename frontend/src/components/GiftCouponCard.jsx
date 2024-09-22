import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import useCartStore from "../store/useCartStore";


const GiftCouponCard = () => {
    const [voucher, setVoucher] = useState("");
    const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

    useEffect(() => { getMyCoupon() }, [getMyCoupon])

    const handleApplyCoupon = async () => {
        if (voucher === "") {
            return;
        }
        await applyCoupon(String(voucher).trim());
    }
    const handleRemoveCoupon = async () => {
        await removeCoupon();
        setVoucher("");
    }
    return (
        <motion.div
            className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="voucher" className="mt-2 block text-sm font-medium text-gray-300">
                        Do you have a voucher or gift card?
                    </label>
                    <input
                        type="text"
                        name="voucher"
                        id="voucher"
                        className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500"
                        placeholder="Enter code here"
                        value={voucher}
                        onChange={(e) => setVoucher(e.target.value)}
                        required />
                </div>
                <motion.button
                    className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleApplyCoupon}
                >
                    Apply Code
                </motion.button>
            </div>
            {
                isCouponApplied &&
                <div className="mt-4 space-y-4">
                    <motion.button
                        className="flex w-full items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleRemoveCoupon}
                    >
                        Remove Coupon
                    </motion.button>
                    <div className="flex flex-col justify-center">
                        <h3 className="text-lg font-medium text-gray-300">
                            Applied Coupon
                        </h3>
                        <p className="mt-2 text-sm text-gray-400">
                            {coupon.code} - {coupon.discountPercentage}% off
                        </p>
                    </div>
                </div>
            }
            {
                coupon && !isCouponApplied &&
                <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-300">
                        Your Available Coupon:
                    </h3>
                    <p className="mt-2 text-sm text-gray-400">
                        {coupon.code} - {coupon.discountPercentage}% off
                    </p>
                </div>
            }
        </motion.div>
    )
}

export default GiftCouponCard