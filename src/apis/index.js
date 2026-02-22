import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

// User
export const registerUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Tài khoản được tạo thành công! Vui lòng kiểm tra và xác minh tài khoản của bạn trước khi đăng nhập!', { theme: 'colored' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Tài khoản được tạo thành công! Bây giờ bạn có thể đăng nhập để tận hưởng dịch vụ của mình!', { theme: 'colored' })
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}

// category
export const getCategoryAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/categories`)
  return response.data
}

export const getCategoryDetailsAPI = async (categoryId) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/categories/${categoryId}`)
  return response.data
}

// product
export const getProductsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/products`)
  return response.data
}
export const getProductDetailAPI = async (productId) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/products/${productId}`)
  return response.data
}

// order
export const createOrderAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/orders`, data)
  return response.data
}

export const getUserOrdersAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/orders/me`)
  return response.data
}

export const canCelOrderAPI = async (orderId) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/orders/${orderId}/cancel`)
  return response.data
}

// coupon
export const getCouponsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/coupons/active`)
  return response.data
}

// admin
export const fetchAdminDashboardAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/dashboard`)
  return response.data
}

export const fetchAdminProductsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/products/admin/all`)
  return response.data
}

export const createAdminProductAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/products`, data)
  return response.data
}

export const updateAdminProductAPI = async (productId, data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/products/${productId}`, data)
  return response.data
}

export const deleteAdminProductAPI = async (productId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/products/${productId}`)
  return response.data
}

export const fetchAdminCategoriesAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/categories`)
  return response.data
}

export const createAdminCategoryAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/categories`, data)
  return response.data
}

export const updateAdminCategoryAPI = async (categoryId, data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/categories/${categoryId}`, data)
  return response.data
}

export const deleteAdminCategoryAPI = async (categoryId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/categories/${categoryId}`)
  return response.data
}

export const fetchAdminOrdersAPI = async (params = {}) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/orders/admin`, { params })
  return response.data
}

export const updateAdminOrderStatusAPI = async (orderId, status) => {
  const response = await authorizeAxiosInstance.patch(`${API_ROOT}/v1/orders/admin/${orderId}/status`, { status })
  return response.data
}

export const fetchAdminCouponsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/coupons`)
  return response.data
}

export const createAdminCouponAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/coupons`, data)
  return response.data
}

export const updateAdminCouponAPI = async (couponId, data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/coupons/${couponId}`, data)
  return response.data
}

export const deleteAdminCouponAPI = async (couponId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/coupons/${couponId}`)
  return response.data
}

export const fetchAdminUsersAPI = async (params = {}) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/users`, { params })
  return response.data
}

export const updateAdminUserRoleAPI = async (userId, data) => {
  const response = await authorizeAxiosInstance.patch(`${API_ROOT}/v1/users/${userId}/status`, data)
  return response.data
}
