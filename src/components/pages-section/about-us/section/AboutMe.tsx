import React from 'react'
import { Fade } from 'react-awesome-reveal'
import { Col, Row } from 'react-bootstrap'

const AboutMe = () => {
    return (
        <>
            <section className="section-about padding-tb-50">
                <div className="container">
                    <Row className="mb-minus-24">
                        {/* <Col lg={6} className="mb-24 col-12">
                            <div className="bb-about-img">
                                <img src="/assets/img/about/one.png" alt="about-one" />
                            </div>
                        </Col> */}
                        <Col lg={12} className="mb-24 col-12">
                            <div className="bb-about-contact">
                                <Fade triggerOnce direction='up' duration={1000} delay={200} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                                    <div className="section-title">
                                        <div className="section-detail">
                                            <h2 className="bb-title">About the <span>Pattikadai</span></h2>
                                        </div>
                                    </div>
                                </Fade>
                                <Fade triggerOnce direction='up' duration={1000} delay={400}>
                                    <div className="about-inner-contact">
                                        <h4>Authentic Tradition, Crafted by Grandma's Hands.</h4>
                                        <p>At Pattikadai, our story is woven from the threads of tradition and the warmth of a grandmother's love. For over seven decades, our grandmother has been the silent guardian of culinary secrets, mastering recipes that celebrate the purity of nature. Her hands, guided by intuition and experience, have crafted foods that are not just meals, but memories.</p>
                                        <p>We, her grandsons, grew up witnessing the magic that happened in her kitchen—where simple, organic ingredients were transformed into extraordinary flavors. We realized that this authenticity was fading from the world, replaced by mass-produced alternatives. Driven by a desire to preserve this heritage, we embarked on a mission to bring her timeless creations to you.</p>
                                        <p>Every product we offer is a tribute to her legacy. We strictly adhere to her traditional methods, ensuring that everything is handmade, organic, and free from artificial additives. From the sourcing of the finest raw materials to the final packaging, we maintain the highest standards of quality, just as she taught us.</p>
                                        <p>Pattikadai is more than a brand; it is a promise of health, taste, and nostalgia. We invite you to savor the difference that 70 years of passion can make. Let us bring the wholesome goodness of our grandmother's kitchen to yours, one authentic bite at a time.</p>
                                    </div>
                                </Fade>
                                {/* <Fade triggerOnce direction='up' duration={1000} delay={600} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
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
                                </Fade> */}
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>
        </>
    )
}

export default AboutMe
