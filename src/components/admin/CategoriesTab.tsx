"use client";

import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Form, Modal } from 'react-bootstrap';
import { adminApi } from '@/utils/adminApi';
import { categoryApi } from '@/utils/api';
import { showSuccessToast, showErrorToast } from '../toast-popup/Toastify';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    parent_id: string | null;
    productCount?: number;
}

const CategoriesTab = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState<Partial<Category>>({
        name: '',
        slug: '',
        description: '',
        image: '',
        parent_id: null,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const cats = await categoryApi.getAll();
            setCategories(Array.isArray(cats) ? cats : []);
        } catch (error: any) {
            console.error('Error fetching categories:', error);
            showErrorToast('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            slug: '',
            description: '',
            image: '',
            parent_id: null,
        });
        setShowModal(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            image: category.image || '',
            parent_id: category.parent_id,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        const category = categories.find(cat => cat.id === id);
        const categoryName = category?.name || 'this category';
        const productCount = category?.productCount || 0;
        
        // Warn if category has products
        if (productCount > 0) {
            if (!window.confirm(
                `Warning: "${categoryName}" has ${productCount} product(s). ` +
                `Deleting this category will fail. Do you want to continue?`
            )) {
                return;
            }
        } else {
            if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
                return;
            }
        }

        try {
            await adminApi.deleteCategory(id);
            showSuccessToast('Category deleted successfully');
            fetchCategories(); // Refresh the list
        } catch (error: any) {
            console.error('Error deleting category:', error);
            showErrorToast(error.message || 'Failed to delete category');
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Generate slug from name if not provided
            const slug = formData.slug || generateSlug(formData.name || '');
            const submitData = { ...formData, slug };

            if (editingCategory) {
                await adminApi.updateCategory(editingCategory.id, submitData);
                showSuccessToast('Category updated successfully');
            } else {
                await adminApi.createCategory(submitData);
                showSuccessToast('Category created successfully');
            }
            setShowModal(false);
            fetchCategories();
        } catch (error: any) {
            console.error('Error saving category:', error);
            showErrorToast(error.message || 'Failed to save category');
        }
    };

    return (
        <div className="bb-admin-categories">
            <div className="bb-admin-header mb-24">
                <Row>
                    <Col lg={6}>
                        <h4>Categories Management</h4>
                    </Col>
                    <Col lg={6} className="text-end">
                        <Button onClick={handleAdd} className="bb-btn-2">
                            <i className="ri-add-line"></i> Add Category
                        </Button>
                    </Col>
                </Row>
            </div>

            {loading ? (
                <p>Loading categories...</p>
            ) : (
                <Table responsive striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Description</th>
                            <th>Products</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center">No categories found</td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.id.substring(0, 8)}...</td>
                                    <td>{category.name}</td>
                                    <td>{category.slug}</td>
                                    <td>{category.description || 'N/A'}</td>
                                    <td>{category.productCount || 0}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleEdit(category)}
                                            className="me-2"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}

            {/* Category Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingCategory ? 'Edit Category' : 'Add Category'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Name *</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                        slug: formData.slug || generateSlug(e.target.value),
                                    });
                                }}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Slug</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="Auto-generated from name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Parent Category</Form.Label>
                            <Form.Select
                                value={formData.parent_id || ''}
                                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                            >
                                <option value="">None (Top Level)</option>
                                {categories
                                    .filter((cat) => !editingCategory || cat.id !== editingCategory.id)
                                    .map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bb-btn-2">
                            {editingCategory ? 'Update' : 'Create'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoriesTab;

