import React, { useEffect, useRef, useState } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useSWR from 'swr';
import fetcher from '@/components/fetcher/Fetcher';
import ZoomProductImage from '../../zoom-product-img/ZoomProductImage';

const SingleProductSlider = ({
    onSuccess = () => { },
    hasPaginate = false,
    onError = () => { },
}) => {
    const [isSliderInitialized, setIsSliderInitialized] = useState(false);
    const initialRef: Slider | null = null;
    const slider1 = useRef<Slider | null>(initialRef);
    const slider2 = useRef<Slider | null>(initialRef);


    const slider1Settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: false,
        asNavFor: slider2.current,
        focusOnSelect: true,
    };

    const slider2Settings = {
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: slider1.current,
        dots: false,
        arrows: true,
        focusOnSelect: true,
    };

    useEffect(() => {
        setIsSliderInitialized(true);
    }, [isSliderInitialized]);

    const handleSlider1Click = (index: any) => {
        if (slider2.current) {
            slider2.current.slickGoTo(index);
        }
    };

    const handleSlider2Click = (index: any) => {
        if (slider1.current) {
            slider1.current.slickGoTo(index);
        }
    };

    const { data, error } = useSWR("/api/product-img", fetcher, {
        onSuccess,
        onError,
    });

    if (error) return <div>Failed to load products</div>;
    if (!data) return <div></div>

    const getData = () => {
        if (hasPaginate) return data.data;
        else return data;
    };
    return (
        <>
            <div className="single-pro-slider">
                <Slider
                    {...slider1Settings}
                    ref={(slider) => {
                        slider1.current = slider;
                    }}
                    asNavFor={slider2.current || undefined}
                    className="single-product-cover">
                    {getData().map((image: any, index: any) => (
                        <div key={index} onClick={() => handleSlider1Click(index)} className="single-slide zoom-image-hover">
                            <ZoomProductImage className="img-responsive" src={image.image}
                                alt="product-1" />
                        </div>
                    ))}
                </Slider>
                <Slider
                    {...slider2Settings}
                    ref={(slider) => {
                        slider2.current = slider;
                    }}
                    asNavFor={slider1.current || undefined}
                    className="single-nav-thumb">
                    {getData().map((image: any, index: any) => (
                        <div key={index} onClick={() => handleSlider2Click(index)} className="single-slide">
                            <img className="img-responsive" src={image.image}
                                alt="product-1" />
                        </div>
                    ))}
                </Slider>
            </div>
        </>
    )
}

export default SingleProductSlider
