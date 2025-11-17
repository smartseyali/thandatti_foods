import React, { useEffect, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import Modal from 'react-bootstrap/Modal'
import StarRating from '../stars/StarRating'
import QuantitySelector from '../quantity-selector/QuantitySelector'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { addItem, updateItemQuantity } from '@/store/reducer/cartSlice'
import { showSuccessToast } from '../toast-popup/Toastify'
import ZoomProductImage from '../products-section/zoom-product-img/ZoomProductImage'
import { Col, Row } from 'react-bootstrap'
import Link from 'next/link'

interface Item {
    id: number;
    title: string;
    newPrice: number;
    weight: string;
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

interface Option {
    value: string;
    tooltip: string;
}

const ItemModal = ({
    closeItemModal,
    isModalOpen,
    data
}: any) => {
    const cartSlice = useSelector((state: RootState) => state.cart?.items);
    const dispatch = useDispatch();
    const [quantites, setQuantity] = useState(1);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const options: Option[] = [
        { value: '250g', tooltip: 'Small' },
        { value: '500g', tooltip: 'Medium' },
        { value: '1kg', tooltip: 'Large' },
        { value: '2kg', tooltip: 'Extra Large' }
    ];

    const handleClick = (index: number) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        if (cartSlice.length === 0) {
            return;
        }
        const subtotal = cartSlice.reduce(
            (acc, item) => acc + item.newPrice * item.quantity,
            0
        );
    }, [cartSlice]);

    const handleCart = (data: Item) => {
        const isItemInCart = cartSlice.some((item: Item) => item.id === data.id);

        if (!isItemInCart) {
            dispatch(addItem({ ...data, quantity: quantites }));
            showSuccessToast("Item added to cart item");
        } else {
            const updatedCartItems = cartSlice.map((item: Item) =>
                item.id === data.id
                    ? { ...item, quantity: item.quantity + quantites, price: item.newPrice + data.newPrice } // Increment quantity and update price
                    : item
            );
            dispatch(updateItemQuantity(updatedCartItems));
            showSuccessToast("Item quantity increased in cart");
        }
    };

    return (
        <Fade triggerOnce duration={500} delay={100}>
            <Modal show={isModalOpen} centered onHide={closeItemModal} keyboard={false} className={`modal fade quickview-modal`} id="bry_quickview_modal" tabIndex={-1} role="dialog">
                <div className="modal-content">
                    <button onClick={closeItemModal} type="button" className="qty-close" data-bs-dismiss="modal" aria-label="Close"
                        title="Close"></button>
                    <Modal.Body>
                        <Row className="mb-minus-24">
                            <Col xs={12} sm={12} md={5} className="mb-24">
                                <div className="single-pro-img single-pro-img-no-sidebar">
                                    <div className="single-product-scroll">
                                        <div className="single-slide zoom-image-hover">
                                            <ZoomProductImage className="img-responsive" src={data?.image} alt="product-img-1" />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={7} className="mb-24">
                                <div className="quickview-pro-content">
                                    <h5 className="bb-quick-title">
                                        <Link href={`/product/${data?.id}`}>{data?.title}</Link>
                                    </h5>
                                    <StarRating rating={data?.rating} />
                                    <div className="bb-quickview-desc">{data?.description || "No description available."}</div>
                                    <div className="bb-quickview-price">
                                        <span className="new-price">₹{((data?.newPrice || 0) * quantites).toFixed(2)}</span>
                                        {data?.oldPrice && <span className="old-price">₹{typeof data.oldPrice === 'number' ? data.oldPrice.toFixed(2) : data.oldPrice}</span>}
                                    </div>
                                    <div className="bb-pro-variation">
                                        <ul>
                                            {options.map((data, index) => (
                                                <li key={index} onClick={() => handleClick(index)} className={activeIndex === index ? "active" : ""}>
                                                    <a  className="bb-opt-sz" data-tooltip={data.tooltip}>{data.value}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bb-quickview-qty">
                                        <div className="qty-plus-minus">
                                            <QuantitySelector setQuantity={setQuantity} quantity={quantites} id={data.id} />
                                        </div>
                                        <div className="bb-quickview-cart">
                                            <button onClick={() => handleCart(data)} type="button" className="bb-btn-1">
                                                <i className="ri-shopping-bag-line"></i>Add To Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                </div>
            </Modal>
        </Fade>
    )
}

export default ItemModal
