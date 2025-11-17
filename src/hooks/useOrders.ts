import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setOrders } from '@/store/reducer/cartSlice';
import { orderApi, mapOrderToFrontend } from '@/utils/api';
import { authStorage } from '@/utils/authStorage';

export const useLoadOrders = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Check if user is authenticated
        if (authStorage.isAuthenticated()) {
          // Load orders from API (database)
          const orders = await orderApi.getAll();
          const mappedOrders = orders.map((order: any) => mapOrderToFrontend(order, order.items));
          dispatch(setOrders(mappedOrders));
        } else {
          // User not authenticated, set empty orders
          dispatch(setOrders([]));
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        // If error, set empty orders (no fallback to localStorage)
        dispatch(setOrders([]));
      }
    };

    loadOrders();
  }, [dispatch]);
};

