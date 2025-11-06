import fetcher from '@/components/fetcher/Fetcher'
import ProductItemCard from '@/components/item/ProductItemCard'
import React from 'react'
import { Fade } from 'react-awesome-reveal'
import { Col } from 'react-bootstrap'
import { Swiper, SwiperSlide } from 'swiper/react'
import useSWR from 'swr'

const Slider = ({
    onSuccess = () => { },
    hasPaginate = false,
    onError = () => { },
}) => {
    const { data, error } = useSWR("/api/deal-slider", fetcher, { onSuccess, onError });

    if (error) return <div>Failed to load products</div>;
    if (!data)
        return (
            <div>
                {/* <Spinner /> */}
            </div>
        );

    const getData = () => {
        if (hasPaginate) return data.data;
        else return data;
    };
    return (
        <div className='col-12'>
            <Swiper
                loop={true}
                autoplay={{ delay: 1000 }} 
                slidesPerView={4}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                    },
                    480: {
                        slidesPerView: 1,
                    },
                    481: {
                        slidesPerView: 2,
                    },
                    767: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1199: {
                        slidesPerView: 3,
                    },
                    1200: {
                        slidesPerView: 4,
                    },
                }}
                className="bb-deal-slider">
                <div className="bb-deal-block owl-carousel">
                    <Fade triggerOnce duration={1000} delay={200} direction='up'>
                        {getData().map((data: any, index: any) => (
                            <SwiperSlide className="bb-deal-card" key={index}>
                                <ProductItemCard data={data} />
                            </SwiperSlide>
                        ))}
                    </Fade>
                </div>
            </Swiper>
        </div>
    )
}

export default Slider
