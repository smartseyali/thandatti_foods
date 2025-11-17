"use client";

import React, { useState } from 'react';
import { Col, Row, Tab, Nav } from 'react-bootstrap';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import DashboardTab from '@/components/admin/DashboardTab';
import ProductsTab from '@/components/admin/ProductsTab';
import CategoriesTab from '@/components/admin/CategoriesTab';
import OrdersTab from '@/components/admin/OrdersTab';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <AdminProtectedRoute>
            <section className="section-admin padding-tb-50">
                <div className="container">
                    <Row>
                        <Col lg={12}>
                            <div className="bb-admin-header mb-24">
                                <h2 className="bb-title">Admin Dashboard</h2>
                                <p>Manage your store products, categories, and orders</p>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'dashboard')}>
                                <Nav variant="tabs" className="bb-admin-tabs mb-24">
                                    <Nav.Item>
                                        <Nav.Link eventKey="dashboard">
                                            <i className="ri-dashboard-line"></i> Dashboard
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="products">
                                            <i className="ri-shopping-bag-line"></i> Products
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="categories">
                                            <i className="ri-folder-line"></i> Categories
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="orders">
                                            <i className="ri-shopping-cart-line"></i> Orders
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>

                                <Tab.Content>
                                    <Tab.Pane eventKey="dashboard">
                                        <DashboardTab />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="products">
                                        <ProductsTab />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="categories">
                                        <CategoriesTab />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="orders">
                                        <OrdersTab />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </Col>
                    </Row>
                </div>
            </section>
        </AdminProtectedRoute>
    );
};

export default AdminPage;

