import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"


const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState({
        users: 0,
        products: 0,
        totalSales: 0,
        totalRevenue: 0,
    });
    const [dailySalesData, setDailySalesData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const res = await axios.get("/analytic");
                setAnalyticsData(res.data.analyticsData);
                setDailySalesData(res.data.dailySalesData);
            } catch (error) {
                console.log("Error fetching analytics data: ", error.message);
            } finally {
                setIsLoading(false)
            }
        }
        fetchAnalyticsData();
    }, [])
    if (isLoading) return <LoadingSpinner />
    console.log(dailySalesData);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AnalyticCard
                    title="Total Users"
                    value={analyticsData.users.toLocaleString()}
                    Icon={Users}
                    color="from-emerald-500 to-teal-700"
                />
                <AnalyticCard
                    title="Total Products"
                    value={analyticsData.products.toLocaleString()}
                    Icon={Package}
                    color="from-emerald-500 to-teal-700"
                />
                <AnalyticCard
                    title="Total Sales"
                    value={analyticsData.totalSales.toLocaleString()}
                    Icon={ShoppingCart}
                    color="from-emerald-500 to-teal-700"
                />
                <AnalyticCard
                    title="Total Revenue"
                    value={analyticsData.totalRevenue.toLocaleString()}
                    Icon={DollarSign}
                    color="from-emerald-500 to-teal-700"
                />
            </div>
            <motion.div
                className="bg-gray-800/60 rounded-lg p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <ResponsiveContainer width='100%' height={400}>
                    <LineChart data={dailySalesData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' stroke='#D1D5DB' />
                        <YAxis yAxisId='left' stroke='#D1D5DB' />
                        <YAxis yAxisId='right' orientation='right' stroke='#D1D5DB' />
                        <Tooltip />
                        <Legend />
                        <Line
                            yAxisId='left'
                            type='monotone'
                            dataKey='sales'
                            stroke='#10B981'
                            activeDot={{ r: 8 }}
                            name='Sales'
                        />
                        <Line
                            yAxisId='right'
                            type='monotone'
                            dataKey='revenue'
                            stroke='#3B82F6'
                            activeDot={{ r: 8 }}
                            name='Revenue'
                        />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    )
}

const AnalyticCard = (props) => {
    const { title, value, Icon, color } = props
    return (
        <motion.div
            className={`bg-gray-800 cursor-pointer rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between">
                <div className="z-10">
                    <p className="text-emerald-300 text-sm mb-1 font-semibold">{title}</p>
                    <h3 className="text-white text-3xl font-bold">{value}</h3>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30" />
                <div className="absolute -bottom-4 -right-4 text-emerald-800 opacity-50">
                    <Icon className="size-32" />
                </div>
            </div>
        </motion.div>
    )
}

export default Analytics