import React from 'react'
import { Col, Row } from 'react-bootstrap'

const BannerTwo = () => {
    return (
        <section className="section-banner-two margin-tb-50">
            <div className="container">
                <Row>
                    <div className="banner-justify-box-contact col-12">
                        <div className="banner-two-box">
                            <span>25% Off</span>
                            <h4>Fresh & Organic vegetables</h4>
                            <a onClick={(e) => e.preventDefault()} href="#" className="bb-btn-1">Shop Now</a>
                        </div>
                    </div>
                </Row>
            </div>
        </section>
    )
}

export default BannerTwo
