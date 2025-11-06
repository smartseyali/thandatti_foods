"use client"
import React from 'react'
import { Navigation, Pagination, EffectFade, Autoplay, Parallax } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import NewsletterModal from '../modal/NewsletterModal'
import { Col, Row } from 'react-bootstrap'
import Link from 'next/link'
import ScrollPage from '../scroll-page/ScrollPage'
import HeroImage from './HeroImage'

const HeroSlider = () => {
    return (
        <>
            <NewsletterModal />
            <section className="section-hero margin-b-50">
                <div className="bb-social-follow">
                    <ul className="inner-links">
                        <li>
                            <a onClick={(e) => e.preventDefault()} href="#">Fb</a>
                        </li>
                        <li>
                            <a onClick={(e) => e.preventDefault()} href="#">Li</a>
                        </li>
                        <li>
                            <a onClick={(e) => e.preventDefault()} href="#">Dr</a>
                        </li>
                        <li>
                            <a onClick={(e) => e.preventDefault()} href="#">In</a>
                        </li>
                    </ul>
                </div>
                <div className="container">
                    <Row>
                        <div className="col-12">
                            <div className="hero-slider swiper-container">
                                <Swiper
                                    pagination={{ clickable: true }}
                                    navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
                                    modules={[Pagination, Navigation, EffectFade, Autoplay, Parallax]}
                                    loop={true}
                                    centeredSlides={true}
                                    speed={1000}
                                    parallax={true}
                                    autoplay={{ delay: 5000 }}
                                    effect="fade"
                                    slidesPerView={1}
                                    className="swiper-wrapper">
                                    <SwiperSlide className="swiper-slide slide-1">
                                        <Row className="mb-minus-24">
                                            <Col lg={6} className="col-12 order-lg-1 order-2 mb-24">
                                                <div className="hero-contact">
                                                    <p>Flat 30% Off</p>
                                                    <h1>Explore <span>Healthy</span><br></br> & Fresh Fruits</h1>
                                                    <Link href="/shop-full-width-col-4" className="bb-btn-1">Shop Now</Link>
                                                </div>
                                            </Col>
                                            <Col lg={6} className="col-12 order-lg-2 order-1 mb-24">
                                                <HeroImage src="/assets/img/hero/hero-1.png" alt="hero" />
                                            </Col>
                                        </Row>
                                    </SwiperSlide>
                                    <SwiperSlide className="swiper-slide slide-2">
                                        <Row className="mb-minus-24">
                                            <Col lg={6} className="col-12 order-lg-1 order-2 mb-24">
                                                <div className="hero-contact">
                                                    <p>Flat 20% Off</p>
                                                    <h2>Explore <span>Warm</span><br></br> Fast Food & Snacks</h2>
                                                    <Link href="/shop-full-width-col-4" className="bb-btn-1">Shop Now</Link>
                                                </div>
                                            </Col>
                                            <Col lg={6} className="col-12 order-lg-2 order-1 mb-24">
                                                <HeroImage src="/assets/img/hero/hero-2.png" alt="hero" />
                                            </Col>
                                        </Row>
                                    </SwiperSlide>
                                    <SwiperSlide className="swiper-slide slide-3">
                                        <Row className="row mb-minus-24">
                                            <Col lg={6} className="col-12 order-lg-1 order-2 mb-24">
                                                <div className="hero-contact">
                                                    <p>Flat 30% Off</p>
                                                    <h2>Explore <span>Organic</span><br></br> & Fresh Vegetables</h2>
                                                    <Link href="/shop-full-width-col-4" className="bb-btn-1">Shop Now</Link>
                                                </div>
                                            </Col>
                                            <Col lg={6} className="col-12 order-lg-2 order-1 mb-24">
                                                <HeroImage src="/assets/img/hero/hero-3.png" alt="hero" />
                                            </Col>
                                        </Row>
                                    </SwiperSlide>
                                    
                                    <div className="swiper-buttons">
                                        <div className="swiper-button-next"></div>
                                        <div className="swiper-button-prev"></div>
                                    </div>
                                </Swiper>

                            </div>
                        </div>
                    </Row>
                </div>
                <ScrollPage />
            </section>
        </>
    )
}

export default HeroSlider
