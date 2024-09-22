import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CreateProduct from "../components/CreateProduct";
import ProductsList from "../components/ProductsList";
import Analytics from "../components/Analytics";
import useProductStore from "../store/useProductStore";
const tabs = [
    { id: "create", label: "Create Product", icon: PlusCircle },
    { id: "products", label: "Products", icon: ShoppingBasket },
    { id: "analytics", label: "Analytics", icon: BarChart },
]
const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("create");
    const { fetchAllProducts } = useProductStore()
    useEffect(() => {
        fetchAllProducts()
    }, [fetchAllProducts])
    return (
        <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-8">
                    Admin Dashboard
                </motion.h1>
                <div className="flex justify-center mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${activeTab === tab.id
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                        >
                            <tab.icon className="size-6 mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>
                {activeTab === "create" && <CreateProduct />}
                {activeTab === "products" && <ProductsList />}
                {activeTab === "analytics" && <Analytics />}
            </div>
        </div>
    )
}

export default AdminPage