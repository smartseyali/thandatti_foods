"use client"
import React from 'react'
import ProductsDetails from './Products-Detail/ProductsDetails'
import ProductsTabs from './Products-Tabs/ProductsTabs'
import { Col } from 'react-bootstrap'

const ProductFullwidth = () => {
    return (
        <Col sm={12}>
            <ProductsDetails />
            <ProductsTabs />
        </Col>
    )
}

export default ProductFullwidth
