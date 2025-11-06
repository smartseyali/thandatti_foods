import { RootState } from '@/store'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { useSelector } from 'react-redux'
import { getRegistrationData } from '../login/Register'
import { Col, Row } from 'react-bootstrap'
import Link from 'next/link'
export interface RegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    postCode: string;
    country: string;
    state: string;
    profilePhoto?: string;
    description: string;
    shippingAddress: string;
}
const UserProfile = () => {
    const router = useRouter()
    const isAuthenticated = useSelector((state: RootState) => state.login.isAuthenticated);
    const [userData, setUserData] = useState<RegistrationData | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            const data = getRegistrationData();
            if (data.length > 0) {
                setUserData(data[data.length - 1]);
            }
        }
    }, [isAuthenticated, router]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        router.push("/profile-edit")
    }
    return (
        <section className="section-cart padding-tb-50">
            <div className="container">
                <Row className="mb-minus-24">
                    <Col lg={3} className="mb-24">
                        <Fade triggerOnce direction='up' duration={1000} delay={200} >
                            <div className="bb-cart-sidebar-block bb-sidebar-wrap bb-border-box bb-sticky-sidebar">
                                <div className="bb-vendor-block-items">
                                    <ul>
                                        <li><Link href="/user-profile">User Profile</Link></li>
                                        <li><Link href="/cart">Cart</Link></li>
                                        <li><Link href="/checkout">Checkout</Link></li>
                                        <li><Link href="/track-order">Track Order</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </Fade>
                    </Col>
                    <Col lg={9}>
                        <Fade triggerOnce direction='up' duration={1000} delay={200} className="bb-cart-table margin-buttom">
                            <Row>
                                <div className="container">
                                    <div className="user-section">
                                        <div className="input-button"
                                            style={{ float: "inline-end", margin: "15px" }}
                                        >
                                            <button
                                                onClick={handleSubmit}
                                                style={{
                                                    backgroundColor: "white",
                                                    padding: "5px 10px",
                                                    borderRadius: "4px",
                                                    border: "none"
                                                }}
                                                className=""
                                                type="submit"
                                            >
                                                Edit <i className="fi fi-re-pencil"></i>
                                            </button>
                                        </div>
                                        <div className="user-detail">
                                            <div className='detail'>
                                                <img src={userData?.profilePhoto || "/assets/img/user-photo/placeholder.jpg"} alt="vendor" />
                                            </div>
                                            <div className="v-detail">
                                                <h5>{userData?.firstName} {userData?.lastName} </h5>
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                    Standard dummy text ever since the 1500s.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Row>
                        </Fade>
                        <Fade triggerOnce direction='up' duration={1000} delay={400} className="bb-cart-table p-30">
                            <div className="">
                                <div className="gi-vendor-card-body">
                                    <div className="bb-vender-about-block">
                                        <h5>About Me</h5>
                                        <p>{userData?.description}</p>
                                    </div>
                                    <div className="bb-vender-about-block">
                                        <h5>Account Information</h5>
                                    </div>
                                    <Row className="mb-minus-24px">
                                        <Col md={6} sm={12} className="mb-24">
                                            <div className="bb-vendor-detail-block">
                                                <h6>E-mail address</h6>
                                                <ul>
                                                    <li><strong>Email : </strong>{userData?.email}</li>

                                                </ul>
                                            </div>
                                        </Col>
                                        <Col md={6} sm={12} className="mb-24">
                                            <div className="bb-vendor-detail-block">
                                                <h6>Contact nubmer</h6>
                                                <ul>
                                                    <li><strong>Phone Nubmer : </strong>(123) {userData?.phoneNumber}</li>
                                                </ul>
                                            </div>
                                        </Col>
                                        <Col md={6} sm={12} className="mb-24">
                                            <div className="bb-vendor-detail-block">
                                                <h6>Address</h6>
                                                <ul>
                                                    <li><strong>Home : </strong>123, {userData?.address}.</li>
                                                </ul>
                                            </div>
                                        </Col>
                                        <Col md={6} sm={12} className="mb-24">
                                            <div className="bb-vendor-detail-block">
                                                <h6>Shipping Address</h6>
                                                <ul>
                                                    <li><strong>Office : </strong>123, {userData?.shippingAddress}</li>
                                                </ul>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Fade>
                    </Col>
                </Row>
            </div>
        </section>
    )
}

export default UserProfile
