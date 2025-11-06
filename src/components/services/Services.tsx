import React from 'react'
import { Fade } from 'react-awesome-reveal';
import { Col, Row } from 'react-bootstrap';

const Services = () => {
    return (
        <section className="section-services padding-tb-50">
            <div className="container">
                <Row className="mb-minus-24">
                    <Col lg={3} md={6} className="mb-24 col-12">
                        <Fade triggerOnce duration={1000} direction='up' delay={200}>
                            <div className="bb-services-box">
                                <div className="services-img">
                                    <img src="/assets/img/services/1.png" alt="services-1" />
                                </div>
                                <div className="services-contact">
                                    <h4>Free Shipping</h4>
                                    <p>Free shipping on all TN orders or above ₹200</p>
                                </div>
                            </div>
                        </Fade>
                    </Col>
                    <Col lg={3} md={6} className="mb-24 col-12">
                        <Fade triggerOnce duration={1000} direction='up' delay={400}>
                            <div className="bb-services-box">
                                <div className="services-img">
                                    <img src="/assets/img/services/2.png" alt="services-2" />
                                </div>
                                <div className="services-contact">
                                    <h4>24x7 Support</h4>
                                    <p>Contact us 24 hours a day, 7 days a week</p>
                                </div>
                            </div>
                        </Fade>
                    </Col>
                    <Col lg={3} md={6} className="mb-24 col-12">
                        <Fade triggerOnce duration={1000} direction='up' delay={600}>
                            <div className="bb-services-box">
                                <div className="services-img">
                                    <img src="/assets/img/services/3.png" alt="services-3" />
                                </div>
                                <div className="services-contact">
                                    <h4>30 Days Return</h4>
                                    <p>Simply return it within 30 days for an exchange</p>
                                </div>
                            </div>
                        </Fade>
                    </Col>
                    <Col lg={3} md={6} className="mb-24 col-12">
                        <Fade triggerOnce duration={1000} direction='up' delay={800}>
                            <div className="bb-services-box">
                                <div className="services-img">
                                    <img src="/assets/img/services/4.png" alt="services-4" />
                                </div>
                                <div className="services-contact">
                                    <h4>Payment Secure</h4>
                                    <p>Contact us 24 hours a day, 7 days a week</p>
                                </div>
                            </div>
                        </Fade>
                    </Col>
                </Row>
            </div>
        </section>
    )
}
export default Services;