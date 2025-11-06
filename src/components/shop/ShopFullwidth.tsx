"use client"
import React from 'react'
import ShopFullwidthProducts from './shop-product-section/ShopFullwidthProducts'
import { Col, Row } from 'react-bootstrap'

const ShopFullwidth = ({
    col,
    colfive,
    width,
    itemsPerPage,
    lg,
}: any) => {
    return (
        <section className="section-shop padding-b-50">
            <div className="container">
                <Row>
                    <Col sm={12}>
                        <ShopFullwidthProducts lg={lg} width={width} colfive={colfive} col={col} itemsPerPage={itemsPerPage} />
                    </Col>
                </Row>
            </div>
        </section>
    )
}

export default ShopFullwidth
