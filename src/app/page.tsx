"use client";
import NewArrivals from "@/components/arrivals/NewArrivals";
import BannerOne from "@/components/banner/BannerOne";
import BannerTwo from "@/components/banner/BannerTwo";
import BlogSlider from "@/components/blog/BlogSlider";
import ExploreCategory from "@/components/category/ExploreCategory";
import CategorySlider from "@/components/category/CategorySlider";
import DealSlider from "@/components/deal-slider/DealSlider";
import HeroSlider from "@/components/hero/HeroSlider";
import QuinnShoppableVideo from "@/components/quinn/QuinnShoppableVideo";
import Services from "@/components/services/Services";
import Testimonials from "@/components/testimonials/Testimonials";
import TopVendor from "@/components/top-vendor/TopVendor";

export default function Home() {
  return (
    <>
      {/* <HeroSlider /> */}
      {/* <ExploreCategory /> */}
      
      <BannerTwo />
      <CategorySlider />
      <BannerOne />
      <NewArrivals />
      <QuinnShoppableVideo />
      {/* <Services /> */}
      {/* <TopVendor /> */}
      {/* <Testimonials /> */}
      {/* <BlogSlider /> */}
      
    </>
  );
}
