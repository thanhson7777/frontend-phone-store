import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Auth from '~/page/Auth/Auth'
import AccountVerifycation from '~/page/Auth/VerifyAccount'

import MainLayout from '~/components/MainLayout/MainLayout'
import HomePage from '~/page/HomePage'
import ProductDetail from './components/Product/ProductDetail'
import CategoryProducts from './components/Category/CategoryProducts'
import Cart from './page/Cart/Cart'
import Checkout from './page/Checkout/Checkout'
import { selectCurrentUser } from './redux/user/userSlice'
import { useSelector } from 'react-redux'
import OrderSuccess from './page/Order/OrderSuccess'
import OrderHistory from './page/Order/OrderHistory'
import Profile from './page/Profile/Profile'
import AdminLayout from './components/Admin/AdminLayout'
import Dashboard from './components/Admin/Dashboard'
import Product from './components/Admin/Product'
import Order from './components/Admin/Order'
import Conpou from './components/Admin/Conpou'
import User from './components/Admin/User'

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  // console.log('currentUser', currentUser)
  return (
    <Routes>

      {/* NHỮNG TRANG CÓ HEADER & FOOTER SẼ NẰM TRONG MAINLAYOUT */}
      <Route element={<MainLayout />}>
        {/* Đường dẫn '/' sẽ load MainLayout, sau đó nhét HomePage vào chỗ <Outlet /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/category/:categoryId" element={<CategoryProducts />} />
        <Route element={< ProtectedRoute user={currentUser} />} >
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/profile/account" element={<Profile />} />
          <Route path="/profile/security" element={<Profile />} />
        </Route>
      </Route>

      {/* NHỮNG TRANG DÀNH RIÊNG CHO ADMIN SẼ NẰM TRONG ADMINLAYOUT */}
      <Route path="/admin" element={<AdminLayout />} >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Product />} />
        <Route path="orders" element={<Order />} />
        <Route path="coupons" element={<Conpou />} />
        <Route path="users" element={<User />} />
      </Route>



      {/* NHỮNG TRANG ĐỘC LẬP (KHÔNG CÓ HEADER/FOOTER) SẼ NẰM NGOÀI */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerifycation />} />

      {/* Tuyến đường bắt lỗi 404 */}
      <Route path="*" element={<h1>404 - Không tìm thấy trang này fen ơi!</h1>} />

    </Routes>
  )
}

export default App