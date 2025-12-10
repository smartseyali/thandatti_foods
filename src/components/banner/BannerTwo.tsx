"use client";
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`custom-slick-arrow custom-slick-next ${className}`}
            style={{ ...style }}
            onClick={onClick}
        >
             <i className="ri-arrow-right-s-line"></i>
        </div>
    );
}

const PrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`custom-slick-arrow custom-slick-prev ${className}`}
            style={{ ...style }}
            onClick={onClick}
        >
            <i className="ri-arrow-left-s-line"></i>
        </div>
    );
}

const BannerTwo = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        className: "banner-two-slider"
    };

    const images = [
        {
            desktop: '/assets/img/banner-two/banner.jpg', 
            mobile: '/assets/img/banner-two/banner_mobile.jpg'
        },
        { 
            desktop: '/assets/img/banner-two/banner1.jpg', 
            mobile: '/assets/img/banner-two/banner_mobile1.jpg' 
        },
        { 
            desktop: '/assets/img/banner-two/banner3.jpg', 
            mobile: '/assets/img/banner-two/banner_mobile2.jpg' 
        }
    ];

    return (
        <section className="section-banner-two">
            <div className="banner-container">
                <Slider {...settings}>
                    {images.map((img, index) => (
                        <div key={index} className="banner-slide-item">
                            <div 
                                className="banner-image-bg banner-desktop-view" 
                                style={{ backgroundImage: `url(${img.desktop})` }}
                            >
                            </div>
                            <div 
                                className="banner-image-bg banner-mobile-view" 
                                style={{ 
                                    backgroundImage: `url(${img.mobile})`,
                                    backgroundPosition: 'center top'
                                }}
                            >
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    )
}

export default BannerTwo;
