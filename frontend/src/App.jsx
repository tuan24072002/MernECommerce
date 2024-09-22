import { Navigate, Route, Routes } from "react-router-dom"

import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import AdminPage from "./pages/AdminPage"

import Navbar from "./components/Navbar"
import LoadingSpinner from "./components/LoadingSpinner"

import useUserStore from "./store/useUserStore"

import { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import CategoryPage from "./pages/CategoryPage"
import CartPage from "./pages/CartPage"
import useCartStore from "./store/useCartStore"
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage"
import PurchaseCancelPage from "./pages/PurchaseCancelPage"


function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartProducts, loadingCart } = useCartStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  useEffect(() => {
    if (!user) {
      return;
    }
    getCartProducts();
  }, [getCartProducts, user])
  if (checkingAuth || loadingCart) {
    return <LoadingSpinner />
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={
            user ?
              <CartPage /> :
              <Navigate to={"/login"} replace />
          } />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/signup" element={
            !user ?
              <SignupPage /> :
              <Navigate to={"/"} replace />
          } />
          <Route path="/login" element={
            !user ?
              <LoginPage /> :
              <Navigate to={"/"} replace />
          } />
          <Route path="/secret-dashboard" element={
            !user
              ? <LoginPage />
              : user?.role !== "admin"
                ? <Navigate to={"/"} replace />
                : <AdminPage />
          } />
          <Route path="/purchase-success" element={user ? <PurchaseSuccessPage /> : <Navigate to={"/login"} replace />} />
          <Route path="/purchase-cancel" element={user ? <PurchaseCancelPage /> : <Navigate to={"/login"} replace />} />
          {/* <Route path="*" element={<Navigate to={"/"} replace />} /> */}
        </Routes>
      </div>
      <Toaster />
    </div>
  )
}

export default App