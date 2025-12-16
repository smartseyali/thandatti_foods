"use client";
import NewArrivals from "@/components/arrivals/NewArrivals";
import BannerOne from "@/components/banner/BannerOne";
import BannerTwo from "@/components/banner/BannerTwo";
import CategorySlider from "@/components/category/CategorySlider";
import QuinnShoppableVideo from "@/components/quinn/QuinnShoppableVideo";

export default function Home() {
  return (
    <>
      <BannerTwo />
      <CategorySlider />
      <BannerOne />
      <NewArrivals />
      <QuinnShoppableVideo />
    </>
  );
}
