"use client";

import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Form, Modal } from 'react-bootstrap';
import { adminApi } from '@/utils/adminApi';
import { locationApi } from '@/utils/api';
import { showSuccessToast, showErrorToast } from '../toast-popup/Toastify';

interface DeliveryCharge {
    id: string;
    state_id: string;
    state_name: string;
    attribute_value: string;
    amount: string; // backend returns decimal string
}

interface State {
    id: string;
    name: string;
}

const DeliveryTab = () => {
    const [charges, setCharges] = useState<DeliveryCharge[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCharge, setEditingCharge] = useState<DeliveryCharge | null>(null);
    const [formData, setFormData] = useState({
        state_id: '',
        attribute_value: '',
        amount: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [chargesData, countriesData] = await Promise.all([
                adminApi.getDeliveryCharges(),
                locationApi.getCountries()
            ]);
            
            setCharges(chargesData);

            // Fetch states for India
            const india = countriesData.find((c: any) => c.name.toLowerCase() === 'india' || c.code === 'IN');
            
            if (india) {
                const statesData = await locationApi.getStates(india.id);
                // Sort states alphabetically
                statesData.sort((a: State, b: State) => a.name.localeCompare(b.name));
                setStates(statesData);
            } else {
                console.warn('Country "India" not found in database');
                setStates([]);
            }

        } catch (error: any) {
            console.error('Error fetching data:', error);
            showErrorToast('Failed to load delivery charges');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCharge(null);
        setFormData({
            state_id: '',
            attribute_value: '',
            amount: '',
        });
        setShowModal(true);
    };

    const handleEdit = (charge: DeliveryCharge) => {
        setEditingCharge(charge);
        // Find state ID if we only have name, but backend getDeliveryCharges returns state_name?
        // Wait, getDeliveryCharges query uses JOIN state. But the frontend needs state_id for binding.
        // If my getDeliveryCharges returns data, let's look at the controller again.
        // It returns: id, state_name, attribute_value, amount.
        // It DOES NOT return state_id directly in the current controller implementation!
        // I should fix the controller to return state_id as well.
        
        // Assuming I fix controller to return state_id OR I emulate it here.
        // But better to fix controller.
        
        setFormData({
            state_id: charge.state_id || '', // Need to ensure backend returns this
            attribute_value: charge.attribute_value,
            amount: charge.amount,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this delivery charge rule?')) {
            return;
        }

        try {
            await adminApi.deleteDeliveryCharge(id);
            showSuccessToast('Delivery charge deleted successfully');
            fetchData();
        } catch (error: any) {
            console.error('Error deleting delivery charge:', error);
            showErrorToast(error.message || 'Failed to delete delivery charge');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCharge) {
                await adminApi.updateDeliveryCharge(editingCharge.id, formData);
                showSuccessToast('Delivery charge updated successfully');
            } else {
                await adminApi.createDeliveryCharge(formData);
                showSuccessToast('Delivery charge created successfully');
            }
            setShowModal(false);
            fetchData();
        } catch (error: any) {
            console.error('Error saving delivery charge:', error);
            showErrorToast(error.message || 'Failed to save delivery charge');
        }
    };

    return (
        <div className="bb-admin-delivery">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                    <Row className="align-items-center">
                        <Col>
                            <h5 className="mb-0">Delivery Charges Management</h5>
                        </Col>
                        <Col className="text-end">
                            <Button onClick={handleAdd} variant="primary" className="d-flex align-items-center gap-2 ms-auto">
                                <i className="ri-add-line"></i> Add Charge
                            </Button>
                        </Col>
                    </Row>
                </div>
                
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 text-muted">Loading data...</p>
                        </div>
                    ) : (
                        <Table responsive hover className="mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="border-0 py-3 ps-4">State</th>
                                    <th className="border-0 py-3">Attribute Value</th>
                                    <th className="border-0 py-3">Amount</th>
                                    <th className="border-0 py-3 pe-4 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {charges.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-5 text-muted">
                                            <i className="ri-truck-line fs-1 d-block mb-2"></i>
                                            No delivery rules found
                                        </td>
                                    </tr>
                                ) : (
                                    charges.map((charge) => (
                                        <tr key={charge.id}>
                                            <td className="ps-4 fw-medium">{charge.state_name}</td>
                                            <td><span className="badge bg-light text-dark fw-normal border">{charge.attribute_value}</span></td>
                                            <td className="fw-bold">₹{parseFloat(charge.amount).toFixed(2)}</td>
                                            <td className="pe-4 text-end">
                                                <Button
                                                    variant="light"
                                                    size="sm"
                                                    onClick={() => handleEdit(charge)}
                                                    className="me-2 text-primary"
                                                    title="Edit"
                                                >
                                                    <i className="ri-edit-line"></i>
                                                </Button>
                                                <Button
                                                    variant="light"
                                                    size="sm"
                                                    onClick={() => handleDelete(charge.id)}
                                                    className="text-danger"
                                                    title="Delete"
                                                >
                                                    <i className="ri-delete-bin-line"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    )}
                </div>
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{editingCharge ? 'Edit Delivery Charge' : 'Add Delivery Charge'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>State <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        value={formData.state_id}
                                        onChange={(e) => setFormData({ ...formData, state_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select State</option>
                                        {states.map((state) => (
                                            <option key={state.id} value={state.id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Attribute Value (e.g., Weight/Size) <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. 500g, 1kg, etc."
                                        value={formData.attribute_value}
                                        onChange={(e) => setFormData({ ...formData, attribute_value: e.target.value })}
                                        required
                                    />
                                    <Form.Text className="text-muted">Must match product attributes exactly.</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Charge Amount (₹) <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {editingCharge ? 'Update Charge' : 'Create Charge'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default DeliveryTab;
