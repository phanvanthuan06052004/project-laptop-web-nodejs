import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  page: 1,
  filters: {
    brand: [],
    price: [],
    cpu: [],
    ram: [],
    storage: []
  },
  sort: "featured"
}

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload
    },
    setFilters: (state, action) => {
      state.filters = action.payload
    },
    setSort: (state, action) => {
      state.sort = action.payload
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.sort = initialState.sort
    }
  }
})

export const { setPage, setFilters, setSort, resetFilters } = productSlice.actions
export default productSlice.reducer
