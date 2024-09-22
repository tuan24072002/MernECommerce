import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useProductStore = create((set) => ({
    loading: false,
    products: [],

    setProducts: (products) => set({ products }),
    createProduct: async (formData) => {
        set({ loading: true })
        try {
            const res = await axios.post("/product", formData);
            set((prev) => ({
                products: [...prev.products, res.data.product]
            }))
        } catch (error) {
            toast.error(error.response.data.error || "An error occurred during create product")
        } finally {
            set({ loading: false })
        }
    },
    fetchAllProducts: async () => {
        set({ loading: true })
        try {
            const res = await axios.get("/product")
            set({ products: res.data.products })
        } catch (error) {
            toast.error(error.response.data.error || "An error occurred during fetch all products")
        } finally {
            set({ loading: false })
        }
    },
    fetchProductsByCategory: async (category) => {
        set({ loading: true })
        try {
            const res = await axios.get(`/product/category/${category}`)
            set({ products: res.data.products })
        } catch (error) {
            toast.error(error.response.data.error || "An error occurred during fetch products by category")
        } finally {
            set({ loading: false })
        }
    },
    deleteProduct: async (id) => {
        set({ loading: true })
        try {
            await axios.delete(`/product/${id}`)
            set((prev) => ({
                products: prev.products.filter((item) => item._id !== id)
            }))
        } catch (error) {
            toast.error(error.response.data.error || "An error occurred during delete product")
        } finally {
            set({ loading: false })
        }
    },
    toggleFeaturedProduct: async (id) => {
        set({ loading: true })
        try {
            const res = await axios.patch(`/product/${id}`)
            set((prev) => ({
                products: prev.products.map((product) => product._id === id ? { ...product, isFeatured: res.data.product.isFeatured } : product)
            }))
        } catch (error) {
            toast.error(error.response.data.error || "An error occurred during toggle featured product")
        } finally {
            set({ loading: false })
        }
    },
    fetchFeaturedProducts: async () => {
        set({ loading: true })
        try {
            const res = await axios.get("/product/featured");
            set({ products: res.data.products })
        } catch (error) {
            toast.error(error.response.data.error || "An error occurred during fetch featured product")
        } finally {
            set({ loading: false })
        }
    }
}))
export default useProductStore;