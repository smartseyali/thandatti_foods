import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface Item {
  id: number;
  date: string
  title: string;
  newPrice: number;
  weight: string;
  image: string;
  imageTwo: string;
  status: string;
  rating: number;
  oldPrice: number;
  location: string;
  brand: string;
  sku: number;
  category: string;
  quantity: number;
}

export interface CounterState {
  wishlist: Item[];
}

const initialState: CounterState = {
  wishlist: [
    {
      title: "Black Pepper Spice pack",
      image: "/assets/img/new-product/5.jpg",
      imageTwo: "/assets/img/new-product/back-5.jpg",
      category: "Spices",
      oldPrice: 22,
      newPrice: 32,
      location: "",
      brand: "",
      sku: 24433,
      date: "",
      id: 5,
      quantity: 1,
      rating: 4,
      status: "",
      weight: "1 pack",
    },
    {
      title: "Small Cardamom Spice Pack",
      image: "/assets/img/new-product/6.jpg",
      imageTwo: "/assets/img/new-product/back-6.jpg",
      category: "Spices",
      oldPrice: 45,
      newPrice: 41,
      location: "",
      brand: '',
      sku: 24433,
      date: "",
      id: 6,
      quantity: 1,
      rating: 5,
      status: "",
      weight: "200g",
    },
    {
      title: "Chilli Flakes Pack",
      image: "/assets/img/new-product/7.jpg",
      imageTwo: "/assets/img/new-product/back-7.jpg",
      category: "Spices",
      oldPrice: 31,
      newPrice: 29,
      location: "",
      brand: "",
      sku: 24433,
      date: "",
      id: 7,
      quantity: 1,
      rating: 2,
      status: "",
      weight: "250g",
    },
  ],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistItems(state, action: PayloadAction<Item[]>) {
      state.wishlist = action.payload;
      // No localStorage - wishlist is stored in database via API
    },
    addWishlist(state, action: PayloadAction<Item>) {
      state.wishlist.push(action.payload);
      // No localStorage - wishlist is stored in database via API
    },
    removeWishlist(state, action: PayloadAction<number | string>) {
      state.wishlist = state.wishlist.filter(
        (item) => item.id !== action.payload);
      // No localStorage - wishlist is stored in database via API
    },
  },
});

export const { addWishlist, removeWishlist, setWishlistItems } = wishlistSlice.actions;

export default wishlistSlice.reducer;
