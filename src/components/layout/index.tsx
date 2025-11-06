"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Loader from "../loader/Loader";
import Toastify from "../toast-popup/Toastify";
import { useDispatch } from "react-redux";
import { setItems } from "@/store/reducer/cartSlice";
import { setWishlistItems } from "@/store/reducer/wishlistSlice";
import { usePathname } from "next/navigation";

const Layout = ({ children }: any) => {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const dispatch = useDispatch();

  useEffect(() => {
    // Start loading animation when the pathname changes
    setLoading(true);

    // End loading animation after a delay to simulate page load time
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust timeout as needed

    // Clear timeout if the component is unmounted or pathname changes again quickly
    return () => clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    const itemsFromLocalStorage =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("products") || "[]")
        : [];
    if (itemsFromLocalStorage.length) {
      dispatch(setItems(itemsFromLocalStorage));
    }
  }, [dispatch]);

  useEffect(() => {
    const itemsFromLocalStorage =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("wishlist") || "[]")
        : [];
    if (itemsFromLocalStorage.length) {
      dispatch(setWishlistItems(itemsFromLocalStorage));
    }
  }, [dispatch]);
  return (
    <>
      <Toastify />
      <Header />
      {loading && <Loader />}
      {children}
      <Footer />
    </>
  );
};

export default Layout;
