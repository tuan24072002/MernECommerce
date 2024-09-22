import express from "express";
import {
    getAllProducts,
    getFeaturedProducts,
    createProduct,
    deleteProduct,
    getRecommendedProducts,
    getProductsByCategory,
    toggleFeaturedProduct
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
//Admin
router.get('/', protectRoute, adminRoute, getAllProducts)
router.post('/', protectRoute, adminRoute, createProduct)
router.delete('/:id', protectRoute, adminRoute, deleteProduct)
router.patch('/:id', protectRoute, adminRoute, toggleFeaturedProduct)

//Customer
router.get('/featured', getFeaturedProducts)
router.get('/recommendations', getRecommendedProducts)
router.get('/category/:category', getProductsByCategory)

export default router;