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
                                    <img src="/assets/img/banner-one/one1.png" alt="one" className="w-100" />
                                </Fade>
                            </Col>
                            <Col lg={6} className="mb-24 col-12">
                                <Fade triggerOnce direction='up' duration={1000} delay={400}>
                                    <img src="/assets/img/banner-one/two2.png" alt="two" className="w-100" />
                            </Fade>
                        </Col>
                    </Row>
                </div>
            </section>        
        </>
    )
}

export default BannerOne
