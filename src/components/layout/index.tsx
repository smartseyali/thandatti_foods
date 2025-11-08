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
import { trackAttribution, getAttributionForConversion } from "@/utils/attribution";

const Layout = ({ children }: any) => {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const dispatch = useDispatch();

  // Initialize attribution tracking on mount
  useEffect(() => {
    // Track attribution on initial page load
    const attribution = trackAttribution();

    // Send page view to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
        page_title: document.title,
        // Add attribution data
        ...(attribution.source && { source: attribution.source }),
        ...(attribution.medium && { medium: attribution.medium }),
        ...(attribution.campaign && { campaign: attribution.campaign }),
      });

      // Track page view event
      (window as any).gtag('event', 'page_view', {
        page_path: window.location.pathname,
        page_title: document.title,
        source: attribution.source || 'direct',
        medium: attribution.medium || 'none',
        campaign: attribution.campaign || '',
        channel: attribution.channel || 'Direct',
      });
    }

    // Send page view to Meta Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView', {
        content_name: document.title,
        content_category: 'page_view',
        source: attribution.source || 'direct',
        medium: attribution.medium || 'none',
        campaign: attribution.campaign || '',
      });
    }
  }, []); // Only run on mount

  useEffect(() => {
    // Start loading animation when the pathname changes
    setLoading(true);

    // Track page view on route change
    if (typeof window !== 'undefined') {
      const attribution = getAttributionForConversion();

      // Update Google Analytics page view
      if ((window as any).gtag) {
        (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
          page_path: pathname,
          page_title: document.title,
        });

        (window as any).gtag('event', 'page_view', {
          page_path: pathname,
          page_title: document.title,
          source: attribution?.source || 'direct',
          medium: attribution?.medium || 'none',
        });
      }

      // Update Meta Pixel page view
      if ((window as any).fbq) {
        (window as any).fbq('track', 'PageView', {
          content_name: document.title,
          source: attribution?.source || 'direct',
        });
      }
    }

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
