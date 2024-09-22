import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react"
import { Link } from "react-router-dom"
import useAuthStore from "../store/useUserStore"
import useCartStore from "../store/useCartStore";
const Navbar = () => {
    const { user, logout } = useAuthStore();
    const { cart } = useCartStore();
    const isAdmin = user?.role === "admin";
    const handleLogout = async () => {
        await logout()
    }
    return (
        <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-xl z-50 transition-all duration-300 border-b border-emerald-800">
            <div className="container mx-auto px-4 py-3">
                <div className="flex flex-wrap items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-emerald-400 flex items-center space-x-2">
                        E-Commerce
                    </Link>
                    <nav className="flex flex-wrap items-center gap-4">
                        <Link to={"/"} className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">Home</Link>
                        {
                            user && (
                                <Link to={"/cart"} className="group relative text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
                                    <ShoppingCart className="inline-block group-hover:text-emerald-400" size={20} />
                                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full px-1.5 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                                        {cart?.length}
                                    </span>
                                </Link>
                            )
                        }
                        {
                            isAdmin && (
                                <Link to={"/secret-dashboard"} className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center">
                                    <Lock className="inline-block" size={18} />
                                    <span className="hidden sm:inline ml-1">Dashboard</span>
                                </Link>
                            )
                        }
                        {
                            user ? (
                                <button onClick={handleLogout} className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center">
                                    <LogOut className="inline-block" size={18} />
                                    <span className="hidden sm:inline ml-2">Logout</span>
                                </button>
                            ) : (
                                <>
                                    <Link to={"/signup"} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center transition duration-300 ease-in-out">
                                        <UserPlus className="inline-block" size={18} />
                                        <span className="hidden sm:inline ml-2">Signup</span>
                                    </Link>
                                    <Link to={"/login"} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center transition duration-300 ease-in-out">
                                        <LogIn className="inline-block" size={18} />
                                        <span className="hidden sm:inline ml-2">Login</span>
                                    </Link>
                                </>
                            )
                        }
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Navbar