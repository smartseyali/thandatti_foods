// Utility functions for cart operations that sync with API
import { cartApi, mapCartItemToFrontend } from './api';
import { setItems } from '@/store/reducer/cartSlice';
import { AppDispatch } from '@/store';
import { authStorage } from './authStorage';

// Check if user is authenticated
const isAuthenticated = (): boolean => {
  return authStorage.isAuthenticated();
};

// Add item to cart (syncs with API - requires authentication)
export const addItemToCart = async (
  dispatch: AppDispatch,
  item: any,
  quantity: number = 1
) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Please login to add items to cart');
    }

    // Add to cart via API (database)
    await cartApi.add(item.id.toString(), quantity);
    
    // Reload cart from API to get updated data
    const cartItems = await cartApi.get();
    const mappedItems = cartItems.map((cartItem: any) => mapCartItemToFrontend(cartItem));
    dispatch(setItems(mappedItems));
    
    return true;
  } catch (error: any) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

// Update cart item quantity (syncs with API - requires authentication)
export const updateCartItemQuantity = async (
  dispatch: AppDispatch,
  cartItemId: string,
  quantity: number,
  currentCartItems?: any[]
) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Please login to update cart');
    }

    // Update cart item via API (database)
    // cartItemId is the cart_item.id (UUID) from the database
    await cartApi.update(cartItemId, quantity);
    
    // Reload cart from API to get updated data
    const updatedCartItems = await cartApi.get();
    const mappedItems = updatedCartItems.map((cartItem: any) => mapCartItemToFrontend(cartItem));
    dispatch(setItems(mappedItems));
    
    return true;
  } catch (error: any) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

// Remove item from cart (syncs with API - requires authentication)
export const removeItemFromCart = async (
  dispatch: AppDispatch,
  cartItemId: string,
  currentCartItems?: any[]
) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Please login to remove items from cart');
    }

    // Remove cart item via API (database)
    // cartItemId is the cart_item.id (UUID) from the database
    await cartApi.remove(cartItemId);
    
    // Reload cart from API to get updated data
    const updatedCartItems = await cartApi.get();
    const mappedItems = updatedCartItems.map((cartItem: any) => mapCartItemToFrontend(cartItem));
    dispatch(setItems(mappedItems));
    
    return true;
  } catch (error: any) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

// Increment item quantity in cart
export const incrementCartItem = async (
  dispatch: AppDispatch,
  item: any,
  currentCartItems: any[]
) => {
  const existingItem = currentCartItems.find((cartItem: any) => cartItem.productId === item.id || cartItem.id === item.id);
  if (existingItem && existingItem.cartItemId) {
    // Use cartItemId for API update
    return await updateCartItemQuantity(dispatch, existingItem.cartItemId, existingItem.quantity + 1);
  } else {
    // Add new item to cart
    return await addItemToCart(dispatch, item, 1);
  }
};

