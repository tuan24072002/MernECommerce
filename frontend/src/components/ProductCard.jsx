import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import useUserStore from "../store/useUserStore"
import useCartStore from "../store/useCartStore";
const ProductCard = ({ product }) => {
    const { user } = useUserStore()
    const { addToCart } = useCartStore()
    const handleAddToCart = async () => {
        toast.dismiss();
        if (!user) {
            return toast.error("Please login to add products to cart", { id: "Login" });
        } else {
            await addToCart(product)
        }
    }
    return (
        <div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
            <div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl group'>
                <img className='object-scale-down z-40 w-full group-hover:scale-125 transition-all duration-500' src={product.image} alt='product image' />
                <div className='absolute inset-0 bg-black bg-opacity-20' />
            </div>

            <div className='mt-4 px-5 pb-5'>
                <h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
                <div className='mt-2 mb-5 flex items-center justify-between'>
                    <p>
                        <span className='text-3xl font-bold text-emerald-400'>${Number(product.price).toFixed(2)}</span>
                    </p>
                </div>
                <button
                    className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
                    onClick={handleAddToCart}
                >
                    <ShoppingCart size={22} className='mr-2' />
                    Add to cart
                </button>
            </div>
        </div>
    )
}

export default ProductCard