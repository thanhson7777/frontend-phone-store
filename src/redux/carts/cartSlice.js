import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentCarts: []
}

export const fetchCartsAPI = createAsyncThunk(
  'carts/fetchCartsAPI',
  async () => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/carts`)
    return response.data
  }
)

export const updateCartsAPI = createAsyncThunk(
  'carts/updateCartsAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/carts/update`, data)
    return response.data
  }
)

export const addToCartAPI = createAsyncThunk(
  'carts/addToCartAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/carts/add`, data)
    return response.data
  }
)

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCurrentCarts: (state) => {
      state.currentCarts = []
    },
    updateCurrentCarts: (state, action) => {
      state.currentCarts = action.payload
    },
    addCurrentCart: (state, action) => {
      state.currentCarts.unshift(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartsAPI.fulfilled, (state, action) => {
      state.currentCarts = action.payload
    })
    builder.addCase(updateCartsAPI.fulfilled, (state, action) => {
      state.currentCarts = action.payload
    })
    builder.addCase(addToCartAPI.fulfilled, (state, action) => {
      state.currentCarts = action.payload
    })
  }
})

export const {
  clearCurrentCarts,
  updateCurrentCarts,
  addCurrentCart
} = cartSlice.actions

export const selectCurrentCarts = (state) => state.cart.currentCarts

export const cartReducer = cartSlice.reducer