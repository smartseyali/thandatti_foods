import React, { useState } from 'react'
import SingleProductSlider from './single-product-slider/SingleProductSlider'
import { Col, Row } from 'react-bootstrap'
import Link from 'next/link';

const ProductsDetails = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [quantity, setQuantity] = useState(1);

    const options = [
        { value: "250g" }, { value: "500g" }, { value: "1kg" }, { value: "2kg" },
    ]

    const handleActiveTab = (index: any) => {
        setActiveIndex(index)
    }

    const handleIncrement = () => {
        setQuantity(prevQty => prevQty + 1);
      };
    
      const handleDecrement = () => {
        setQuantity(prevQty => (prevQty > 1 ? prevQty - 1 : 1));
      };
    return (
        <>
            <div className="bb-single-pro">
                <Row>
                    <Col sm={12} lg={5} className="col-12 mb-24">
                        <SingleProductSlider />
                    </Col>
                    <Col lg={7} className="col-12 mb-24">
                        <div className="bb-single-pro-contact">
                            <div className="bb-sub-title">
                                <h4>Ground Nuts Oil Pack 52g</h4>
                            </div>
                            <div className="bb-single-rating">
                                <span className="bb-pro-rating">
                                    <i className="ri-star-fill"></i>
                                    <i className="ri-star-fill"></i>
                                    <i className="ri-star-fill"></i>
                                    <i className="ri-star-fill"></i>
                                    <i className="ri-star-line"></i>
                                </span>
                                <span className="bb-read-review">
                                    |&nbsp;&nbsp;<Link href="#bb-spt-nav-review">992 Ratings</Link>
                                </span>
                            </div>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas nihil laboriosam
                                voluptatem
                                ab consectetur dolorum id, soluta sunt at culpa commodi totam quod natus qui!
                            </p>
                            <div className="bb-single-price-wrap">
                                <div className="bb-single-price">
                                    <div className="price">
                                        <h5>₹923.00 <span>-78%</span></h5>
                                    </div>
                                    <div className="mrp">
                                        <p>M.R.P. : <span>₹1,999.00</span></p>
                                    </div>
                                </div>
                                <div className="bb-single-price">
                                    <div className="sku">
                                        <h5>SKU#: WH12</h5>
                                    </div>
                                    <div className="stock">
                                        <span>In stock</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bb-single-list">
                                <ul>
                                    <li><span>Closure :</span> Hook & Loop</li>
                                    <li><span>Sole :</span> Polyvinyl Chloride</li>
                                    <li><span>Width :</span> Medium</li>
                                    <li><span>Outer Material :</span> A-Grade Standard Quality</li>
                                </ul>
                            </div>
                            <div className="bb-single-pro-weight">
                                <div className="pro-title">
                                    <h4>Weight</h4>
                                </div>
                                <div className="bb-pro-variation-contant">
                                    <ul>
                                        {options.map((data, index) => (
                                            <li key={index} onClick={() => handleActiveTab(index)} className={activeIndex === index ? "active-variation" : ""}>
                                                <span>{data.value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="bb-single-qty">
                                <div className="qty-plus-minus">
                                    <div
                                    onClick={handleDecrement}
                                        className='bb-qtybtn'
                                        style={{ margin: " 0 0 0 10px" }}
                                    >
                                        -
                                    </div>
                                    <input
                                        readOnly
                                        className="qty-input location-select"
                                        type="text"
                                        name="gi-qtybtn"
                                        value={quantity}
                                    />
                                    <div onClick={handleIncrement} className='bb-qtybtn'
                                        style={{ margin: " 0 10px 0 0" }}
                                    >
                                        +
                                    </div>
                                </div>
                                <div className="buttons">
                                    <Link href="/cart" className="bb-btn-2">View Cart</Link>
                                </div>
                                <ul className="bb-pro-actions">
                                    <li className="bb-btn-group">
                                        <a onClick={(e) => e.preventDefault()} href="#">
                                            <i className="ri-heart-line"></i>
                                        </a>
                                    </li>
                                    <li className="bb-btn-group">
                                        <a onClick={(e) => e.preventDefault()} href="#" data-link-action="quickview" title="Quick view" data-bs-toggle="modal"
                                            data-bs-target="#bry_quickview_modal">
                                            <i className="ri-eye-line"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default ProductsDetails
