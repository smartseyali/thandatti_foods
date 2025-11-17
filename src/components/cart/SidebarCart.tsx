
import { RootState } from '@/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import QuantitySelector from '../quantity-selector/QuantitySelector';
import fetcher from '../fetcher/Fetcher';
import useSWR from 'swr';
import ProductItemCard from '../item/ProductItemCard';
import { Col, Row } from 'react-bootstrap';
import Link from 'next/link';
import { removeItemFromCart } from '@/utils/cartOperations';
import { showErrorToast, showSuccessToast } from '../toast-popup/Toastify';

const SidebarCart = ({
    onSuccess = () => { },
    hasPaginate = false,
    onError = () => { },
    isCartOpen,
    closeCart }: any) => {

    const cartSlice = useSelector((state: RootState) => state.cart?.items);
    const [subTotal, setSubTotal] = useState(0);
    const [vat, setVat] = useState(0);
    const dispatch = useDispatch();

    // Fetch related products (multiple products for the sidebar)
    const { data, error } = useSWR("/api/related-products", fetcher, { onSuccess, onError });

    useEffect(() => {
        if (cartSlice.length === 0) {
            setSubTotal(0);
            setVat(0);
            return;
        }

        const subtotal = cartSlice.reduce(
            (acc, item) => acc + item.newPrice * item.quantity,
            0
        );
        setSubTotal(subtotal);

        const vatAmount = subtotal * 0.2;
        setVat(vatAmount);
    }, [cartSlice]);

    const total = subTotal + vat;

    if (error) return <div>Failed to load products</div>;
    if (!data) return <div></div>;

    const getData = () => {
        // Ensure we always return an array
        if (hasPaginate) {
            return Array.isArray(data.data) ? data.data : [];
        } else {
            // If data is an array, return it; if it's a single object, wrap it in an array
            if (Array.isArray(data)) {
                return data;
            } else if (data && typeof data === 'object') {
                // Single product object - wrap in array
                return [data];
            }
            return [];
        }
    };

    const handleRemoveItem = async (data: any) => {
        try {
            // Use cartItemId if available, otherwise use id
            const cartItemId = data.cartItemId || data.id;
            await removeItemFromCart(dispatch, cartItemId);
            showSuccessToast("Item removed from cart");
        } catch (error: any) {
            console.error('Error removing item:', error);
            showErrorToast(error.message || "Failed to remove item from cart");
        }
    }
    return (
        <>
            <div onClick={closeCart} style={{ display: isCartOpen ? "block" : "none" }} className="bb-side-cart-overlay"></div>
            <div className={`bb-side-cart ${isCartOpen ? "bb-open-cart" : ""}`}>
                <Row className="row h-full">
                    <Col md={5} className="col-12 d-none-767">
                        <div className="bb-top-contact">
                            <div className="bb-cart-title">
                                <h4>Related Items</h4>
                            </div>
                        </div>
                        <div className="bb-cart-box mb-minus-24 cart-related bb-border-right">
                            <div className="bb-deal-card mb-24">
                                {getData().map((data: any, index: any) => (
                                    <ProductItemCard data={data} key={index} />
                                ))}
                            </div>
                            <div className="bb-cart-banner mb-24">
                                <div className="banner">
                                    <img src="/assets/img/category/cart-banner.jpg" alt="cart-banner" />
                                    <div className="detail">
                                        <h4>Organic & Fresh</h4>
                                        <h3>Vegetables</h3>
                                        <Link href="/shop-full-width-col-4">Buy Now</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={7} className="col-12">
                        <div className="bb-inner-cart">
                            <div className="bb-top-contact">
                                <div className="bb-cart-title">
                                    <h4>My cart</h4>
                                    <a onClick={closeCart} className="bb-cart-close" title="Close Cart"></a>
                                </div>
                            </div>
                            <div className="bb-cart-box item">
                                {cartSlice.length === 0 ? (<div>Your cart is empty</div>) : (
                                    <ul className="bb-cart-items">
                                        {cartSlice.map((data: any, index: any) => (
                                            <li key={index} className="cart-sidebar-list">
                                                <a onClick={() => handleRemoveItem(data)} className="cart-remove-item"><i className="ri-close-line"></i></a>
                                                <a onClick={(e) => e.preventDefault()} href="#" className="bb-cart-pro-img">
                                                    <img src={data.image} alt="product-img-1" />
                                                </a>
                                                <div className="bb-cart-contact">
                                                    <Link href={`/product/${data.id}`} className="bb-cart-sub-title">{data.title}</Link>
                                                    <span className="cart-price"><span className="new-price">₹{(data.newPrice * data.quantity).toFixed(2)}</span>{' '} x {data.weight}</span>
                                                      <div className="qty-plus-minus">
                                                          <QuantitySelector id={data.id} quantity={data.quantity} cartItemId={data.cartItemId} />
                                                      </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="bb-bottom-cart">
                                {cartSlice.length ? (
                                    <div className="cart-sub-total">
                                        <table className="table cart-table">
                                            <tbody>
                                                <tr>
                                                    <td className="title">Sub-Total :</td>
                                                    <td className="price">₹{subTotal.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title">VAT (20%) :</td>
                                                    <td className="price">₹{vat.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title">Total :</td>
                                                    <td className="price">₹{total.toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ) : <></>}
                                <div className="cart-btn">
                                    <Link href="/cart" className="bb-btn-1" onClick={closeCart}>View Cart</Link>
                                    <Link href="/checkout" className="bb-btn-2" onClick={closeCart}>Checkout</Link>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div >
        </>
    )
}

export default SidebarCart;
