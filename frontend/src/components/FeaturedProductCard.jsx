import { ShoppingCart } from "lucide-react";
import useCartStore from "../store/useCartStore";
import useUserStore from "../store/useUserStore";
import toast from "react-hot-toast";

const FeaturedProductCard = ({ product }) => {
    const { addToCart } = useCartStore();
    const { user } = useUserStore();
    const handleAddToCart = async () => {
        toast.dismiss();
        if (!user) {
            return toast.error("Please login to add products to cart", { id: "Login" });
        } else {
            await addToCart(product)
        }
    }
    return (
        <div className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'>
            <div className='bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30'>
                <div className='overflow-hidden'>
                    <img
                        src={product.image}
                        alt={product.name}
                        className='w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110'
                    />
                </div>
                <div className='p-4'>
                    <h3 className='text-lg font-semibold mb-2 text-white'>{product.name}</h3>
                    <p className='text-emerald-300 font-medium mb-4'>
                        ${product.price.toFixed(2)}
                    </p>
                    <button
                        onClick={() => handleAddToCart()}
                        className='w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 
												flex items-center justify-center'
                    >
                        <ShoppingCart className='w-5 h-5 mr-2' />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FeaturedProductCard