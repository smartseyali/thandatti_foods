"use client";

import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Form, Modal } from 'react-bootstrap';
import { adminApi } from '@/utils/adminApi';
import { showSuccessToast, showErrorToast } from '../toast-popup/Toastify';

interface OrderItem {
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
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

    const fetchOrders = async () => {
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
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage, statusFilter]);

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

    return (
        <div className="bb-admin-orders">
            <div className="bb-admin-header mb-24">
                <Row>
                    <Col lg={6}>
                        <h4>Orders Management</h4>
                    </Col>
                    <Col lg={6}>
                        <Form.Select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </Form.Select>
                    </Col>
                </Row>
            </div>

            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <>
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>Order Number</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Payment Status</th>
                                <th>Order Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center">No orders found</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>#{order.order_number}</td>
                                        <td>
                                            {order.user_first_name && order.user_last_name
                                                ? `${order.user_first_name} ${order.user_last_name}`
                                                : order.user_email || 'N/A'}
                                        </td>
                                        <td>{order.total_items}</td>
                                        <td>₹{order.total_price.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadgeClass(order.payment_status)}`}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                                {order.status || 'pending'}
                                            </span>
                                        </td>
                                        <td>{formatDate(order.created_at)}</td>
                                        <td>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleViewOrder(order)}
                                            >
                                                View/Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bb-admin-pagination mt-3">
                            <Button
                                variant="outline-primary"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </Button>
                            <span className="mx-3">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline-primary"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}

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
                                        {selectedOrder.user_first_name && selectedOrder.user_last_name
                                            ? `${selectedOrder.user_first_name} ${selectedOrder.user_last_name}`
                                            : 'N/A'}
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
                                                <td>{item.product?.title || 'Product'}</td>
                                                <td>{item.quantity}</td>
                                                <td>₹{item.unit_price.toFixed(2)}</td>
                                                <td>₹{item.total_price.toFixed(2)}</td>
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
                                        <strong>Subtotal:</strong> ₹{selectedOrder.subtotal.toFixed(2)}
                                    </p>
                                    <p>
                                        <strong>Discount:</strong> ₹{selectedOrder.discount_amount.toFixed(2)}
                                    </p>
                                    <p>
                                        <strong>VAT:</strong> ₹{selectedOrder.vat.toFixed(2)}
                                    </p>
                                    <p>
                                        <strong>Total:</strong> ₹{selectedOrder.total_price.toFixed(2)}
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

