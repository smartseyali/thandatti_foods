"use client"
import { RootState } from '@/store';
import React, { useEffect, useState } from 'react'
import { Fade } from 'react-awesome-reveal';
import { useSelector } from 'react-redux';
import { useLoadOrders } from '@/hooks/useOrders';
import { orderApi, mapOrderToFrontend } from '@/utils/api';

interface Product {
    id: number;
    title: string;
    newPrice: number;
    waight: string;
    image: string;
    imageTwo: string;
    date: string;
    status: string;
    rating: number;
    oldPrice: number;
    location: string;
    brand: string;
    sku: number;
    category: string;
    quantity: number;
}

interface Order {
    products: Product[];
}

const OrderPage = ({ id }: any) => {
    const orders = useSelector((state: RootState) => state.cart.orders);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState<string>(
        new Date().toLocaleDateString("en-GB")
    );
    
    useLoadOrders();

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString("en-GB"));
    }, []);

    useEffect(() => {
        const loadOrder = async () => {
            try {
                // First check Redux store
                let foundOrder = orders.find((order: any) => (order as any).orderId === id);
                
                if (!foundOrder) {
                    // If not found, try to fetch from API
                    try {
                        const orderData = await orderApi.getById(id);
                        foundOrder = mapOrderToFrontend(orderData, orderData.items);
                    } catch (error) {
                        console.error('Error fetching order:', error);
                    }
                }
                
                setOrder(foundOrder || null);
            } catch (error) {
                console.error('Error loading order:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadOrder();
        }
    }, [id, orders]);

    function isOrderWithData(obj: any): obj is Order {
        return (
            typeof obj === "object" && obj !== null && Array.isArray(obj.products)
        );
    }

    return (
        <>
            <section className="section-cart padding-tb-50">
                <div className="container">
                    <div className="row mb-minus-24">
                        <div className="col-12 mb-24">
                            <Fade triggerOnce direction='up' duration={1000} delay={200} className="bb-cart-table">
                                <table style={{ width: '100%' }}>
                                    <thead>
                                        <tr style={{ textAlign: "center" }}>
                                            <th>ID</th>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Date</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={5} style={{ textAlign: "center" }}>
                                                    <span style={{ color: "#777" }}>Loading...</span>
                                                </td>
                                            </tr>
                                        ) : isOrderWithData(order) ? (order.products.map((product: Product, productIndex: number) => (
                                            <tr style={{ textAlign: "center" }} key={productIndex}>
                                                <td>
                                                    <span>{productIndex + 1}</span>
                                                </td>
                                                <td>
                                                    <a onClick={(e) => e.preventDefault()} href="#">
                                                        <div className="Product-cart">
                                                            <img src={product.image} alt="new-product-5" />
                                                        </div>
                                                    </a>
                                                </td>
                                                <td>
                                                    <span>{product.title}</span>
                                                </td>
                                                <td>
                                                    <span>{currentDate}</span>
                                                </td>
                                                <td>
                                                    <span className="price">${product.newPrice}</span>
                                                </td>
                                            </tr>
                                        ))) : (
                                            <tr>
                                                <td colSpan={12}>
                                                    <span style={{ color: "#777" }}>
                                                        Order list empty...
                                                    </span>
                                                </td>
                                            </tr>
                                        )}

                                    </tbody>
                                </table>
                            </Fade>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default OrderPage
