import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Item {
    productId: string;
    name: string;
    slug: string;
    price?: number;
    platform: string;
    region: string;
    edition: string;
    productImageUrl: string;
    quantity?: number;
}

interface ProductState {
  selectedItem: Item | null;
  items: Item[];
}

const initialState: ProductState = {
  selectedItem: null,
  items: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<Item>) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setSelectedItem, clearSelectedItem, setItems } = productSlice.actions;
export default productSlice.reducer;