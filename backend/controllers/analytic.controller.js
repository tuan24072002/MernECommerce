import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

const getAnalyticsData = async () => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null, // it groups all documents together,
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" },
            },
        },
    ]);

    const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

    return {
        users: totalUsers,
        products: totalProducts,
        totalSales,
        totalRevenue,
    };
}
const getDailySalesData = async (startDate, endDate) => {
    try {
        const dailySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSales: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" },
                },
            },
            { $sort: { _id: 1 } }
        ]);
        // example of dailySalesData
        // [
        // 	{
        // 		_id: "2024-08-18",
        // 		sales: 12,
        // 		revenue: 1450.75
        // 	},
        // ]
        const dateArray = getDatesInRange(startDate, endDate);
        // console.log(dateArray) // ['2024-08-18', '2024-08-19', ... ]
        return dateArray.map(date => {
            const foundData = dailySalesData.find(item => item._id === date)
            return {
                date,
                sales: foundData?.totalSales || 0,
                revenue: foundData?.totalRevenue || 0
            }
        })
    } catch (error) {
        throw error;
    }
}
const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}
export const getAnalytics = async (req, res) => {
    try {
        const analyticsData = await getAnalyticsData();
        const startDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        const endDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
        const dailySalesData = await getDailySalesData(startDate, endDate);
        res.json({
            analyticsData,
            dailySalesData
        })
    } catch (error) {
        console.log("Error in getAnalytics controller", error.message);
        res.status(500).json({ message: error.message })
    }
}
