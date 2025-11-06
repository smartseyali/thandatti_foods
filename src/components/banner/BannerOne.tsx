import Link from 'next/link'
import React from 'react'
import { Fade } from 'react-awesome-reveal'
import { Col, Row } from 'react-bootstrap'

const BannerOne = () => {
    return (
        <>
            <section className="section-banner-one padding-tb-50">
                <div className="container">
                    <Row className="mb-minus-24">
                        <Col lg={6} className="mb-24 col-12">
                            <Fade triggerOnce direction='up' duration={1000} delay={400}>
                                <div className="banner-box bg-box-color-one">
                                    <div className="inner-banner-box">
                                        <div className="side-image">
                                            <img src="/assets/img/banner-one/one.png" alt="one" />
                                        </div>
                                        <div className="inner-contact">
                                            <h5>Tasty Snack & Fast food</h5>
                                            <p>The flavour of something special</p>
                                            <Link href="/shop-full-width-col-4" className="bb-btn-1">Shop Now</Link>
                                        </div>
                                    </div>
                                </div>
                            </Fade>
                        </Col>
                        <Col lg={6} className="mb-24 col-12">
                            <Fade triggerOnce direction='up' duration={1000} delay={400}>
                                <div className="banner-box bg-box-color-two">
                                    <div className="inner-banner-box">
                                        <div className="side-image">
                                            <img src="/assets/img/banner-one/two.png" alt="two" />
                                        </div>
                                        <div className="inner-contact">
                                            <h5>Fresh Fruits & Vegetables</h5>
                                            <p>A healthy meal for every one</p>
                                            <Link href="/shop-left-sidebar-col-3" className="bb-btn-1">Shop Now</Link>
                                        </div>
                                    </div>
                                </div>
                            </Fade>
                        </Col>
                    </Row>
                </div>
            </section>        
        </>
    )
}

export default BannerOne
