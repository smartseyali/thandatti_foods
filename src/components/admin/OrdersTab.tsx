"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Button, Form, Modal } from 'react-bootstrap';
import { adminApi } from '@/utils/adminApi';
import { showSuccessToast, showErrorToast } from '../toast-popup/Toastify';

interface OrderItem {
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    title?: string;
    primary_image?: string;
    product?: {
        title: string;
        primary_image: string;
    };
}

interface Order {
    id: string;
    order_number: string;
    user_id: string;
    user_email?: string;
    user_first_name?: string;
    user_last_name?: string;
    shipping_first_name?: string;
    shipping_last_name?: string;
    shipping_address?: string;
    shipping_city?: string;
    shipping_postal_code?: string;
    shipping_country?: string;
    billing_address?: string;
    billing_city?: string;
    total_items: number;
    subtotal: number;
    discount_amount: number;
    vat: number;
    total_price: number;
    payment_method: string;
    payment_status: string;
    status: string;
    created_at: string;
    items?: OrderItem[];
}

const OrdersTab = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [newStatus, setNewStatus] = useState<string>('');

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await adminApi.getAllOrders({
                page: currentPage,
                limit: 20,
                status: statusFilter || undefined,
            });
            setOrders(response.orders || []);
            setTotalPages(response.pagination?.totalPages || 1);
        } catch (error: any) {
            console.error('Error fetching orders:', error);
            showErrorToast('Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [currentPage, statusFilter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setShowModal(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder || !newStatus) {
            return;
        }

        try {
            await adminApi.updateOrderStatus(selectedOrder.id, newStatus);
            showSuccessToast('Order status updated successfully');
            setShowModal(false);
            fetchOrders();
        } catch (error: any) {
            console.error('Error updating order status:', error);
            showErrorToast(error.message || 'Failed to update order status');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatPrice = (price: any) => {
        const numPrice = parseFloat(price);
        return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-success';
            case 'pending':
                return 'bg-warning';
            case 'cancelled':
                return 'bg-danger';
            case 'processing':
                return 'bg-info';
            default:
                return 'bg-secondary';
        }
    };

    const getCustomerName = (order: Order) => {
        if (order.user_first_name && order.user_last_name) {
            return `${order.user_first_name} ${order.user_last_name}`;
        }
        if (order.shipping_first_name && order.shipping_last_name) {
            return `${order.shipping_first_name} ${order.shipping_last_name}`;
        }
        return order.user_email || 'Guest User';
    };

    return (
        <div className="bb-admin-orders">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <h5 className="mb-0">Orders Management</h5>
                        </Col>
                        <Col lg={6}>
                            <div className="d-flex justify-content-end align-items-center">
                                <span className="me-2 text-muted small">Filter by:</span>
                                <Form.Select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="form-select-sm w-auto"
                                    style={{minWidth: '150px'}}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </Form.Select>
                            </div>
                        </Col>
                    </Row>
                </div>

                <div className="card-body p-0">
                    {loading ? (
                         <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 text-muted">Loading orders...</p>
                        </div>
                    ) : (
                        <>
                            <Table responsive hover className="mb-0 align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="border-0 py-3 ps-4">Order Number</th>
                                        <th className="border-0 py-3">Customer</th>
                                        <th className="border-0 py-3">Items</th>
                                        <th className="border-0 py-3">Total</th>
                                        <th className="border-0 py-3">Payment</th>
                                        <th className="border-0 py-3">Status</th>
                                        <th className="border-0 py-3">Date</th>
                                        <th className="border-0 py-3 pe-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center py-5 text-muted">
                                                <i className="ri-shopping-cart-2-line fs-1 d-block mb-2"></i>
                                                No orders found
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="ps-4"><span className="fw-medium">#{order.order_number}</span></td>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <span className="fw-medium">{getCustomerName(order)}</span>
                                                        <span className="text-muted small">{order.user_email}</span>
                                                    </div>
                                                </td>
                                                <td>{order.total_items}</td>
                                                <td><span className="fw-medium">₹{formatPrice(order.total_price)}</span></td>
                                                <td>
                                                    <span className={`badge ${getStatusBadgeClass(order.payment_status)} rounded-pill`}>
                                                        {order.payment_status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadgeClass(order.status)} rounded-pill`}>
                                                        {order.status || 'pending'}
                                                    </span>
                                                </td>
                                                <td className="text-muted small">{formatDate(order.created_at)}</td>
                                                <td className="pe-4">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => handleViewOrder(order)}
                                                        className="d-flex align-items-center gap-1"
                                                    >
                                                        <i className="ri-eye-line"></i> View
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light">
                                    <div className="text-muted small">
                                        Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                                    </div>
                                    <div className="btn-group">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Order #{selectedOrder?.order_number}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <h5>Customer Information</h5>
                                    <p>
                                        <strong>Name:</strong>{' '}
                                        {getCustomerName(selectedOrder)}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {selectedOrder.user_email || 'N/A'}
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <h5>Shipping Address</h5>
                                    <p>
                                        {selectedOrder.shipping_address || 'N/A'}
                                        <br />
                                        {selectedOrder.shipping_city || ''}
                                        {selectedOrder.shipping_postal_code ? `, ${selectedOrder.shipping_postal_code}` : ''}
                                        <br />
                                        {selectedOrder.shipping_country || ''}
                                    </p>
                                </Col>
                            </Row>

                            <h5>Order Items</h5>
                            <Table striped bordered size="sm">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Unit Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.title || item.product?.title || 'Product'}</td>
                                                <td>{item.quantity}</td>
                                                <td>₹{formatPrice(item.unit_price)}</td>
                                                <td>₹{formatPrice(item.total_price)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center">No items</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>

                            <Row className="mt-3">
                                <Col md={6}>
                                    <p>
                                        <strong>Subtotal:</strong> ₹{formatPrice(selectedOrder.subtotal)}
                                    </p>
                                    <p>
                                        <strong>Discount:</strong> ₹{formatPrice(selectedOrder.discount_amount)}
                                    </p>
                                    <p>
                                        <strong>VAT:</strong> ₹{formatPrice(selectedOrder.vat)}
                                    </p>
                                    <p>
                                        <strong>Total:</strong> ₹{formatPrice(selectedOrder.total_price)}
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <p>
                                        <strong>Payment Method:</strong> {selectedOrder.payment_method || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Payment Status:</strong>{' '}
                                        <span className={`badge ${getStatusBadgeClass(selectedOrder.payment_status)}`}>
                                            {selectedOrder.payment_status}
                                        </span>
                                    </p>
                                    <Form.Group className="mt-3">
                                        <Form.Label>
                                            <strong>Order Status</strong>
                                        </Form.Label>
                                        <Form.Select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button
                        className="bb-btn-2"
                        onClick={handleUpdateStatus}
                        disabled={!newStatus || newStatus === selectedOrder?.status}
                    >
                        Update Status
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrdersTab;

