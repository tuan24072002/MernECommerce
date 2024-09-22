import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Loader } from "lucide-react";
import { motion } from "framer-motion";
import useUserStore from "../store/useUserStore";

const SignupPage = () => {
    const { loading, signup } = useUserStore();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(formData)
    }
    const handleOnChange = (e) => {
        setFormData(pre => ({
            ...pre,
            [e.target.name]: e.target.value
        }))
    }
    return (
        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <motion.div
                className="sm:mx-auto sm:w-full sm:max-w-md"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">Create your account</h2>
            </motion.div>
            <motion.div
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col justify-center">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full name</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="size-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => handleOnChange(e)}
                                    className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-50 sm:text-sm" placeholder="John Doe"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => handleOnChange(e)}
                                    className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-50 sm:text-sm" placeholder="you@example.com"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => handleOnChange(e)}
                                    className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-50 sm:text-sm" placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleOnChange(e)}
                                    className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-50 sm:text-sm" placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="flex justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-300 ease-in-out disabled:opacity-50"
                        >
                            {
                                loading ? <>
                                    <Loader className="size-5 mr-2 animate-spin" aria-hidden='true' />
                                    <span>Loading...</span>
                                </> : <>
                                    <UserPlus className="size-5 mr-2" aria-hidden='true' />
                                    <span>Sign Up</span>
                                </>
                            }
                        </button>
                    </form>
                    <p className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link to={"/login"} className="font-medium text-emerald-400 hover:text-emerald-300">
                            Login here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default SignupPage