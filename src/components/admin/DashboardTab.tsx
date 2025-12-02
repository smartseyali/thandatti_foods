"use client";

import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { adminApi } from '@/utils/adminApi';
import { showErrorToast } from '../toast-popup/Toastify';

const DashboardTab = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: 0,
        ordersByStatus: {},
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await adminApi.getStats();
                setStats(data);
            } catch (error: any) {
                console.error('Error fetching stats:', error);
                showErrorToast('Failed to load dashboard statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="bb-admin-loading">
                <p>Loading statistics...</p>
            </div>
        );
    }

    return (
        <div className="bb-admin-dashboard">
            <Row className="mb-minus-24">
                <Col lg={3} md={6} className="mb-24">
                    <div className="bb-admin-stat-card">
                        <div className="stat-icon">
                            <i className="ri-shopping-bag-line"></i>
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalProducts}</h3>
                            <p>Total Products</p>
                        </div>
                    </div>
                </Col>
                <Col lg={3} md={6} className="mb-24">
                    <div className="bb-admin-stat-card">
                        <div className="stat-icon">
                            <i className="ri-folder-line"></i>
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalCategories}</h3>
                            <p>Total Categories</p>
                        </div>
                    </div>
                </Col>
                <Col lg={3} md={6} className="mb-24">
                    <div className="bb-admin-stat-card">
                        <div className="stat-icon">
                            <i className="ri-shopping-cart-line"></i>
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalOrders}</h3>
                            <p>Total Orders</p>
                        </div>
                    </div>
                </Col>
                <Col lg={3} md={6} className="mb-24">
                    <div className="bb-admin-stat-card">
                        <div className="stat-icon">
                            <i className="ri-money-rupee-circle-line"></i>
                        </div>
                        <div className="stat-content">
                            <h3>₹{parseFloat(stats.totalRevenue as any || 0).toFixed(2)}</h3>
                            <p>Total Revenue</p>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg={6} className="mb-24">
                    <div className="bb-admin-stat-card">
                        <div className="stat-content">
                            <h4>Recent Orders (Last 7 Days)</h4>
                            <h3>{stats.recentOrders}</h3>
                        </div>
                    </div>
                </Col>
                <Col lg={6} className="mb-24">
                    <div className="bb-admin-stat-card">
                        <div className="stat-content">
                            <h4>Orders by Status</h4>
                            <div className="orders-status-list">
                                {Object.entries(stats.ordersByStatus || {}).map(([status, count]: [string, any]) => (
                                    <div key={status} className="status-item">
                                        <span className="status-name">{status}:</span>
                                        <span className="status-count">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardTab;

