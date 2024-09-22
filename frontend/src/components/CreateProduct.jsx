import { motion } from "framer-motion"
import { useState } from "react"
import { PlusCircle, Upload, Loader } from "lucide-react"
import useProductStore from "../store/useProductStore";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];
const CreateProduct = () => {
    const { loading, createProduct } = useProductStore()
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        image: "",
        category: ""
    })
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createProduct(formData)
            setFormData({ name: "", description: "", price: 0, image: "", category: "" })
        } catch {
            console.log("Error creating a product");
        }
    }
    const handleOnChange = (e) => {
        setFormData(pre => ({
            ...pre,
            [e.target.name]: e.target.value
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result })
            }
            reader.readAsDataURL(file) // base 64
        }
    }
    return (
        <motion.div
            className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className="text-2xl text-center font-semibold mb-6 text-emerald-300">Create New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                        Product Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleOnChange}
                        required
                        disabled={loading}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor='description' className='block text-sm font-medium text-gray-300'>
                        Description
                    </label>
                    <textarea
                        id='description'
                        name='description'
                        value={formData.description}
                        onChange={handleOnChange}
                        rows='3'
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500'
                        required
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor='price' className='block text-sm font-medium text-gray-300'>
                        Price
                    </label>
                    <input
                        type='number'
                        id='price'
                        name='price'
                        value={formData.price}
                        onChange={handleOnChange}
                        step='0.01'
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
                        required
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor='category' className='block text-sm font-medium text-gray-300'>
                        Category
                    </label>
                    <select
                        id='category'
                        name='category'
                        value={formData.category}
                        onChange={handleOnChange}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        required
                        disabled={loading}
                    >
                        <option value=''>Select a category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='flex items-center'>
                    <input type='file' id='image' className='sr-only' accept='image/*' multiple onChange={handleImageChange} required disabled={loading} />
                    <label
                        htmlFor='image'
                        className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                    >
                        <Upload className='h-5 w-5 inline-block mr-2' />
                        Upload Image
                    </label>
                    {formData.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>}
                </div>

                <button
                    type='submit'
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                            Loading...
                        </>
                    ) : (
                        <>
                            <PlusCircle className='mr-2 h-5 w-5' />
                            Create Product
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    )
}

export default CreateProduct;