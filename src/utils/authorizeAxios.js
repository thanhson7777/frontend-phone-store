import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElement } from './formatter'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { refreshTokenAPI } from '~/apis'

// Không thể import { store } from '~/redux/store bởi vì nó không phải là components của react
// Phải dùng kĩ thuật injectStore
let axiosReduxStore

export const injectStore = mainStore => { axiosReduxStore = mainStore }

// Khởi tạo đối tượng axios
const authorizeAxiosInstance = axios.create()

// thời gian chờ tối đa của một req
authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10
// tự động gửi cookie trong mỗi req lên backend (jwt)
authorizeAxiosInstance.defaults.withCredentials = true

// cấu hình interceptors
// can thiệp vào những request gửi lên
authorizeAxiosInstance.interceptors.request.use((config) => {
  // Kĩ thuật chặn spam click
  interceptorLoadingElement(true)
  // Kĩ thuật chặn spam click
  interceptorLoadingElement(true)

  let token = localStorage.getItem('accessToken')

  if (token && token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1)
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// Khởi tạo promise để gọi api refreshToken
let refreshTokenPromise = null

// Can thiệp vào những response nhận về
authorizeAxiosInstance.interceptors.response.use((response) => {
  interceptorLoadingElement(false)
  return response
}, (error) => {
  interceptorLoadingElement(false)

  // Lỗi 401 thì cho đăng xuất
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  // Lỗi 410 thì gọi api refreshToken để làm mới lại accessToken
  // Lấy các api lỗi thông qua error.config
  const originalRequest = error.config

  if (error.response?.status === 410 && !originalRequest._retry) {
    originalRequest._retry = true

    // Nếu chưa có refreshTokenPromise thì gọi api refresh_token và gán vào refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          // accessToken đã có trong httpOnly cookie
          return data?.accessToken
        })
        .catch((_error) => {
          // Nếu api refreshToken bị lỗi thì cho logout
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error)
        })
        .finally(() => {
          // Gán refreshTokenPromise về null như lúc đầu
          refreshTokenPromise = null
        })
    }

    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      return authorizeAxiosInstance(originalRequest)
    })
  }

  // Xử lí lỗi tập trung một lần trả về từ API
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }

  // Dùng toastify để hiển thị tất cả các lỗi (trừ mã 410 - mã token hết hạn)
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizeAxiosInstance