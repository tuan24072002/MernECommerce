import { motion } from "framer-motion"
import { Trash, Star } from "lucide-react"
import useProductStore from "../store/useProductStore"

const ProductsList = () => {
    const { products, deleteProduct, toggleFeaturedProduct, loading } = useProductStore()
    return (
        <motion.div
            className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Product
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Price
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Category
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Featured
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className={`bg-gray-800 divide-y divide-gray-700 ${loading && "animate-pulse"}`}>
                    {
                        products?.map((product) => (
                            <tr key={product?._id} className="hover:bg-gray-600">
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex justify-center items-center">
                                        <div className="flex-shrink-0 size-10">
                                            <img
                                                className="size-10 rounded-full object-cover"
                                                src={product?.image}
                                                alt={product?.image} />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-white">{product?.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <p className="text-sm text-gray-300">${Number(product?.price).toFixed(2)}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <p className="text-sm text-gray-300">{product?.category}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        disabled={loading}
                                        onClick={() => toggleFeaturedProduct(product._id)}
                                        className={`p-1 rounded-full hover:bg-yellow-500 transition-colors duration-300
                                             ${product?.isFeatured
                                                ? "bg-yellow-400 text-gray-900"
                                                : "bg-gray-600 text-gray-300"}`}
                                    >
                                        <Star className="size-5" />
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        disabled={loading}
                                        onClick={() => deleteProduct(product._id)}
                                        className={`p-1 rounded-full bg-gray-600 text-red-400 hover:text-red-300 transition-colors duration-300`}
                                    >
                                        <Trash className="size-5" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </motion.div>
    )
}

export default ProductsList