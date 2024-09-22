import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
    try {
        const userId = req.user._id;
        const coupon = await Coupon.findOne({ userId, isActive: true });
        return res.json({ coupon } || null);
    } catch (error) {
        console.log("Error in getCoupon controller", error.message);
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}
export const validateCoupon = async (req, res) => {
    try {
        const userId = req.user._id;
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code, userId, isActive: true });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({ message: "Coupon expired" });
        }
        return res.json({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage
        });
    } catch (error) {
        console.log("Error in validateCoupon controller", error.message);
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}