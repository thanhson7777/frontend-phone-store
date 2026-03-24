import authorizeAxiosInstance, {
  publicAxiosInstance,
} from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";
import { toast } from "react-toastify";

// User
export const registerUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/users/register`,
    data,
  );
  toast.success(
    "Tài khoản được tạo thành công! Vui lòng kiểm tra và xác minh tài khoản của bạn trước khi đăng nhập!",
    { theme: "colored" },
  );
  return response.data;
};

export const verifyUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/users/verify`,
    data,
  );
  toast.success(
    "Tài khoản được tạo thành công! Bây giờ bạn có thể đăng nhập để tận hưởng dịch vụ của mình!",
    { theme: "colored" },
  );
  return response.data;
};

export const refreshTokenAPI = async () => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/users/refresh_token`,
  );
  return response.data;
};

export const forgotPasswordAPI = async (email) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/users/forgot_password`,
    { email },
  );
  return response.data;
};

export const resetPasswordAPI = async (token, newPassword) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/users/reset_password`,
    { token, newPassword },
  );
  return response.data;
};

// category
export const getCategoryAPI = async (params = {}) => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/categories`,
    { params },
  );
  return response.data;
};

export const getCategoryDetailsAPI = async (categoryId) => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/categories/${categoryId}`,
  );
  return response.data;
};

// product
export const getProductsAPI = async (params = {}) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/products`, {
    params,
  });
  return response.data;
};
export const getProductDetailAPI = async (productId) => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/products/${productId}`,
  );
  return response.data;
};

// review
export const getProductReviewsAPI = async (productId, params = {}) => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/reviews/product/${productId}`,
    { params },
  );
  return response.data;
};

// order
export const createOrderAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/orders`,
    data,
  );
  return response.data;
};

export const getUserOrdersAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/orders/me`);
  return response.data;
};

export const canCelOrderAPI = async (orderId) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/orders/${orderId}/cancel`,
  );
  return response.data;
};

// coupon
export const getCouponsAPI = async () => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/coupons/active`,
  );
  return response.data;
};

// admin
export const fetchAdminDashboardAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/dashboard`);
  return response.data;
};

export const fetchAdminProductsAPI = async () => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/products/admin/all`,
  );
  return response.data;
};

export const createAdminProductAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/products`,
    data,
  );
  return response.data;
};

export const updateAdminProductAPI = async (productId, data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/products/${productId}`,
    data,
  );
  return response.data;
};

export const deleteAdminProductAPI = async (productId) => {
  const response = await authorizeAxiosInstance.delete(
    `${API_ROOT}/v1/products/${productId}`,
  );
  return response.data;
};

export const fetchAdminCategoriesAPI = async () => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/categories`,
  );
  return response.data;
};

export const createAdminCategoryAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/categories`,
    data,
  );
  return response.data;
};

export const updateAdminCategoryAPI = async (categoryId, data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/categories/${categoryId}`,
    data,
  );
  return response.data;
};

export const deleteAdminCategoryAPI = async (categoryId) => {
  const response = await authorizeAxiosInstance.delete(
    `${API_ROOT}/v1/categories/${categoryId}`,
  );
  return response.data;
};

export const fetchAdminOrdersAPI = async (params = {}) => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/orders/admin`,
    { params },
  );
  return response.data;
};

export const updateAdminOrderStatusAPI = async (orderId, status) => {
  const response = await authorizeAxiosInstance.patch(
    `${API_ROOT}/v1/orders/admin/${orderId}/status`,
    { status },
  );
  return response.data;
};

export const fetchAdminCouponsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/coupons`);
  return response.data;
};

export const createAdminCouponAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/coupons`,
    data,
  );
  return response.data;
};

export const updateAdminCouponAPI = async (couponId, data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/coupons/${couponId}`,
    data,
  );
  return response.data;
};

export const deleteAdminCouponAPI = async (couponId) => {
  const response = await authorizeAxiosInstance.delete(
    `${API_ROOT}/v1/coupons/${couponId}`,
  );
  return response.data;
};

export const fetchAdminUsersAPI = async (params = {}) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/users`, {
    params,
  });
  return response.data;
};

export const updateAdminUserRoleAPI = async (userId, data) => {
  const response = await authorizeAxiosInstance.patch(
    `${API_ROOT}/v1/users/${userId}/status`,
    data,
  );
  return response.data;
};

// banner (public — trang chủ)
export const getActiveBannersAPI = async () => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/banners/active`,
  );
  return response.data
};

// banner (admin)
export const fetchAdminBannersAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/banners`);
  return response.data;
};

export const createAdminBannerAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/banners`,
    data,
  );
  return response.data;
};

export const updateAdminBannerAPI = async (bannerId, data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/banners/${bannerId}`,
    data,
  );
  return response.data;
};

export const deleteAdminBannerAPI = async (bannerId) => {
  const response = await authorizeAxiosInstance.delete(
    `${API_ROOT}/v1/banners/${bannerId}`,
  );
  return response.data;
};

// article (public)
export const getPublishedArticlesAPI = async (params = {}) => {
  const response = await publicAxiosInstance.get(
    `${API_ROOT}/v1/articles/published`,
    { params },
  );
  return response.data;
};

export const getArticlesByCategoryPublicAPI = async (category) => {
  const response = await publicAxiosInstance.get(
    `${API_ROOT}/v1/articles/category/${category}`,
  );
  return response.data;
};

export const getArticleDetailPublicAPI = async (slugOrId) => {
  const response = await publicAxiosInstance.get(
    `${API_ROOT}/v1/articles/${slugOrId}`,
  );
  return response.data;
};

// article (admin)
export const fetchAdminArticlesAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/articles`);
  return response.data;
};

export const createAdminArticleAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/articles`,
    data,
  );
  return response.data;
};

export const updateAdminArticleAPI = async (articleId, data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/articles/${articleId}`,
    data,
  );
  return response.data;
};

export const deleteAdminArticleAPI = async (articleId) => {
  const response = await authorizeAxiosInstance.delete(
    `${API_ROOT}/v1/articles/${articleId}`,
  );
  return response.data;
};

// contact (public — gửi tin nhắn liên hệ)
export const submitContactMessageAPI = async (data) => {
  const response = await publicAxiosInstance.post(
    `${API_ROOT}/v1/contact/messages`,
    data,
  );
  return response.data;
};

// contact (admin)
export const fetchAdminContactInfoAPI = async () => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/contact/info`,
  );
  return response.data;
};

export const updateAdminContactInfoAPI = async (data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/contact/admin/info`,
    data,
  );
  return response.data;
};

export const fetchAdminContactMessagesAPI = async () => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/contact/admin/messages`,
  );
  return response.data;
};

export const replyContactMessageAPI = async (messageId, data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/contact/admin/messages/${messageId}/reply`,
    data,
  );
  return response.data;
};

export const deleteContactMessageAPI = async (messageId) => {
  const response = await authorizeAxiosInstance.delete(
    `${API_ROOT}/v1/contact/admin/messages/${messageId}`,
  );
  return response.data;
};
