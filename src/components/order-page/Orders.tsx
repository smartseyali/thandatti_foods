"use client"
import { RootState } from '@/store';
import React, { useEffect, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { useSelector } from 'react-redux';
import { useLoadOrders } from '../login/Checkout';
import { useRouter } from 'next/navigation';
import { Row } from 'react-bootstrap';

const Orders = () => {
    const orders = useSelector((state: RootState) => state.cart.orders);
    const router = useRouter()

    const [currentDate, setCurrentDate] = useState(
        new Date().toLocaleDateString("en-GB")
    );

    useLoadOrders();

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString("en-GB"));
    }, []);

    const handleViewBtn = (orderId: any) => {
        router.push(`/orders/${orderId}`);
    };

    return (
        <>
            <section className="section-cart padding-tb-50">
                <div className="container">
                    <Row className="mb-minus-24">
                        <div className="col-12 mb-24">
                            <Fade triggerOnce direction='up' duration={1000} delay={200} className="bb-cart-table">
                                <table style={{ width: '100%' }}>
                                    <thead>
                                        <tr style={{ textAlign: "center" }}>
                                            <th>Orders ID</th>
                                            <th>Shipping</th>
                                            <th>Quantity</th>
                                            <th>Date</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.filter((order: any) => order.status ==
                                            "Pending").map((data: any, index) => (
                                                <tr style={{ textAlign: "center" }} key={index}>
                                                    <td>
                                                        <a onClick={(e) => e.preventDefault()} href="#">
                                                            <div className="Product-cart">
                                                                <span>{data.orderId}</span>
                                                            </div>
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <span className="price">{data.shippingMethod}</span>
                                                    </td>
                                                    <td>
                                                        <span className="price">{data.totalItems}</span>
                                                    </td>
                                                    <td>
                                                        <span className="price">{currentDate}</span>
                                                    </td>
                                                    <td>
                                                        <span className="price">{data.totalPrice}</span>
                                                    </td>
                                                    <td>
                                                        <span className="price">{data.status}</span>
                                                    </td>
                                                    <td>
                                                        <div className="cart-btn">
                                                            <button className='bb-btn-1 btn-padding' onClick={() => handleViewBtn(data.orderId)}>
                                                                View
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                    </tbody>
                                </table>
                            </Fade>
                        </div>
                    </Row>
                </div>
            </section>
            <section className="section-cart padding-tb-50">
                <div className="container">
                    <Row className="mb-minus-24">
                        <div className="col-12 mb-24">
                            <Fade triggerOnce direction='up' duration={1000} delay={200} className="bb-cart-table">
                                <table style={{ width: '100%' }}>
                                    <thead>
                                        <tr style={{textAlign: "center"}}>
                                            <th>Orders ID</th>
                                            <th>Shipping</th>
                                            <th>Quantity</th>
                                            <th>Date</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.filter((order: any) => order.status == "Completed").map((data: any, index) => (
                                            <tr style={{ textAlign: "center" }} key={index}>
                                                <td>
                                                    <a onClick={(e) => e.preventDefault()} href="#">
                                                        <div className="Product-cart">
                                                            <span>{data.orderId}</span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td>
                                                    <span className="price">{data.shippingMethod}</span>
                                                </td>
                                                <td>
                                                    <span className="price">{data.totalItems}</span>
                                                </td>
                                                <td>
                                                    <span className="price">{currentDate}</span>
                                                </td>
                                                <td>
                                                    <span className="price">{data.totalPrice}</span>
                                                </td>
                                                <td>
                                                    <span className="price">{data.status}</span>
                                                </td>
                                                <td>
                                                    <div className="cart-btn">
                                                        <button className='bb-btn-1 btn-padding' onClick={() => handleViewBtn(data.orderId)}>
                                                            View
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </Fade>
                        </div>
                    </Row>
                </div>
            </section>
        </>
    )
}

export default Orders
