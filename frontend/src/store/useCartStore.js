import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const useCartStore = create((set, get) => ({
    loadingCart: false,
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    subtotalEachProduct: [],
    isCouponApplied: false,
    getMyCoupon: async () => {
        try {
            const res = await axios.get("/coupon")
            set({ coupon: res.data.coupon })
        } catch (error) {
            toast.error(error.response.data.error || "An error occurred during fetch coupon")
        }
    },
    applyCoupon: async (code) => {
        try {
            const res = await axios.post("/coupon/validate", { code })
            set({ coupon: res.data, isCouponApplied: true })
            get().calculateTotals();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error || "An error occurred during apply coupon")
        }
    },
    removeCoupon: () => {
        set({ coupon: null, isCouponApplied: false });
        get().calculateTotals();
        toast.success("Coupon removed");
    },
    getCartProducts: async () => {
        set({ loadingCart: true })
        try {
            const res = await axios.get("/cart");
            set({ cart: res.data.carts });
            get().calculateTotals();
            get().calculateSubtotalEachProduct();
        } catch (error) {
            set({ cart: [] })
            console.log(error.message);
            // toast.error(error.response.data.error || "An error occurred during fetch all cart products")
        } finally {
            set({ loadingCart: false })
        }
    },
    addToCart: async (product) => {
        try {
            await axios.post("/cart", { productId: product._id });
            toast.success("Added to cart");
            set((pre) => {
                const existingProduct = pre.cart.find((item) => item._id === product._id);
                const newCart = existingProduct
                    ? pre.cart.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
                    : [...pre.cart, { ...product, quantity: 1 }]
                return { cart: newCart }
            });
            get().calculateTotals();
            get().calculateSubtotalEachProduct();
        } catch (error) {
            set({ cart: [] });
            toast.error(error.response.data.error || "An error occurred during add product to cart")
        }
    },
    removeFromCart: async (productId) => {
        await axios.delete("/cart", { data: { productId } });
        set((pre) => ({
            cart: pre.cart.filter(item => item._id !== productId)
        }));
        get().calculateTotals();
        get().calculateSubtotalEachProduct();
    },
    updateQuantity: async (productId, quantity) => {
        if (quantity === 0) {
            get().removeFromCart(productId);
            return;
        }
        await axios.put(`cart/${productId}`, { quantity });
        set((pre) => ({
            cart: pre.cart.map((item) => (
                item._id === productId ? { ...item, quantity } : item
            ))
        }))
        get().calculateTotals();
        get().calculateSubtotalEachProduct();
    },
    calculateTotals: () => {
        const { cart, coupon } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subtotal;
        if (coupon) {
            const discount = subtotal * (coupon.discountPercentage / 100);
            total = subtotal - discount;
        }
        set({ subtotal, total })
    },
    calculateSubtotalEachProduct: () => {
        const { cart } = get();
        const updatedSubtotals = cart.map((item) => {
            const subtotal = item.quantity * item.price;
            const productId = item._id
            return { productId, subtotal };
        });
        set({ subtotalEachProduct: updatedSubtotals })
    },
    clearCart: async () => {
        await axios.delete("/cart");
        set({ cart: [], coupon: null, total: 0, subtotal: 0 });
    },
}))
export default useCartStore;