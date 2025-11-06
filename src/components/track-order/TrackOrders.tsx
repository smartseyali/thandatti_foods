import React from 'react'
import { Fade } from 'react-awesome-reveal'
import { Col, Row } from 'react-bootstrap'

const TrackOrders = () => {

    return (
        <section className="section-track padding-tb-50">
            <div className="container">
                <Row>
                    <Col sm={12}>
                        <Fade triggerOnce direction='up' duration={1000} delay={200} className="section-title bb-center">
                            <div className="section-detail">
                                <h2 className="bb-title">Track<span> order</span></h2>
                                <p>check your arriving order.</p>
                            </div>
                        </Fade>
                    </Col>
                    <Col sm={12}>
                        <div className="track">
                            <Row className="mb-minus-24">
                                <Col md={4} className="mb-24">
                                    <div className="block-title">
                                        <h6>Order</h6>
                                        <p>#2453</p>
                                    </div>
                                </Col>
                                <Col md={4} className="mb-24">
                                    <div className="block-title">
                                        <h6>Jalapeno Poppers</h6>
                                        <p>bb6874tf</p>
                                    </div>
                                </Col>
                                <Col md={4} className="mb-24">
                                    <div className="block-title">
                                        <h6>Expected date</h6>
                                        <p>May 15, 2025</p>
                                    </div>
                                </Col>
                                <Col md={12} className="mb-24">
                                    <ul className="bb-progress">
                                        <li className="active">
                                            <span className="number">1</span>
                                            <span className="icon"><i className="ri-check-double-line"></i></span>
                                            <span className="title">Order<br></br>Confirmed</span>
                                        </li>
                                        <li className="active">
                                            <span className="number">2</span>
                                            <span className="icon"><i className="ri-settings-line"></i></span>
                                            <span className="title">Processing<br></br>Order</span>
                                        </li>
                                        <li className="active">
                                            <span className="number">3</span>
                                            <span className="icon"><i className="ri-gift-2-line"></i></span>
                                            <span className="title">Quality<br></br>Check</span>
                                        </li>
                                        <li className="">
                                            <span className="number">4</span>
                                            <span className="icon"><i className="ri-truck-line"></i></span>
                                            <span className="title">Product<br></br>Dispatched</span>
                                        </li>
                                        <li className="">
                                            <span className="number">5</span>
                                            <span className="icon"><i className="ri-home-office-line"></i></span>
                                            <span className="title">Product<br></br>Delivered</span>
                                        </li>
                                    </ul>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        </section>
    )
}

export default TrackOrders
