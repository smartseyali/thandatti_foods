import React from 'react'
import { Fade } from 'react-awesome-reveal'
import { Col, Row } from 'react-bootstrap'

const AboutMe = () => {
    return (
        <>
            <section className="section-about padding-tb-50">
                <div className="container">
                    <Row className="mb-minus-24">
                        <Col lg={6} className="mb-24 col-12">
                            <div className="bb-about-img">
                                <img src="/assets/img/about/one.png" alt="about-one" />
                            </div>
                        </Col>
                        <Col lg={6}  className="mb-24 col-12">
                            <div className="bb-about-contact">
                                <Fade triggerOnce direction='up' duration={1000} delay={200} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                                    <div className="section-title">
                                        <div className="section-detail">
                                            <h2 className="bb-title">About the <span>Thandatti foods</span></h2>
                                        </div>
                                    </div>
                                </Fade>
                                <Fade triggerOnce direction='up' duration={1000} delay={400}>
                                    <div className="about-inner-contact">
                                        <h4>Farm-fresh Goodness, just a click Away.</h4>
                                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit, rem! Et
                                            obcaecati rem nulla, aut assumenda unde minima earum distinctio porro excepturi
                                            veritatis officiis dolorem quod. sapiente amet rerum beatae dignissimos aperiam
                                            id quae quia velit. Ab optio doloribus hic quas sit corporis numquam.</p>
                                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit, rem! Et
                                            obcaecati rem nulla, aut assumenda unde minima earum distinctio porro excepturi
                                            veritatis officiis dolorem quod. sapiente amet rerum beatae dignissimos aperiam
                                            id quae quia velit. Ab optio doloribus hic quas sit corporis numquam.</p>
                                    </div>
                                </Fade>
                                <Fade triggerOnce direction='up' duration={1000} delay={600} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
                                    <Row className="bb-vendor-rows row mb-minus-24">
                                        <Col sm={4} className="mb-24">
                                            <div className="bb-vendor-box">
                                                <div className="bb-count">
                                                    <h5 className="counter">200 +</h5>
                                                </div>
                                                <div className="inner-text">
                                                    <p>vendors</p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={4} className="mb-24">
                                            <div className="bb-vendor-box">
                                                <div className="bb-count">
                                                    <h5 className="counter">654k +</h5>
                                                </div>
                                                <div className="inner-text">
                                                    <p>Sales</p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={4} className="mb-24">
                                            <div className="bb-vendor-box">
                                                <div className="bb-count">
                                                    <h5 className="counter">587k +</h5>
                                                </div>
                                                <div className="inner-text">
                                                    <p>Customers</p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Fade>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>
        </>
    )
}

export default AboutMe
