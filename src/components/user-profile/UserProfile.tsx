import { RootState } from '@/store'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { useSelector } from 'react-redux'
import { authApi } from '@/utils/authApi'
import { getUserData, RegistrationData } from '@/utils/userData'
import { Col, Row } from 'react-bootstrap'
import Link from 'next/link'

const UserProfile = () => {
    const router = useRouter()
    const isAuthenticated = useSelector((state: RootState) => state.login.isAuthenticated);
    const user = useSelector((state: RootState) => state.login.user);
    const [userData, setUserData] = useState<RegistrationData | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated) {
                try {
                    // Fetch latest user data from API
                    const apiUser = await authApi.getCurrentUser();
                    
                    if (apiUser) {
                        const data: RegistrationData = {
                            uid: apiUser.id,
                            firstName: apiUser.first_name || apiUser.firstName || '',
                            lastName: apiUser.last_name || apiUser.lastName || '',
                            email: apiUser.email || '',
                            phoneNumber: apiUser.phone_number || apiUser.phoneNumber || '',
                            address: apiUser.address || '',
                            city: apiUser.city || '',
                            postCode: apiUser.postal_code || apiUser.postCode || '',
                            country: apiUser.country || '',
                            state: apiUser.state || '',
                            profilePhoto: apiUser.profile_photo || apiUser.profilePhoto || '',
                            description: apiUser.description || '',
                            shippingAddress: apiUser.shipping_address || apiUser.shippingAddress || '',
                        };
                        setUserData(data);
                    } else if (user) {
                        // Fallback to Redux store
                        const data: RegistrationData = {
                            uid: user.id || user.uid,
                            firstName: user.firstName || '',
                            lastName: user.lastName || '',
                            email: user.email || '',
                            phoneNumber: user.phoneNumber || '',
                            address: user.address || '',
                            city: user.city || '',
                            postCode: user.postCode || '',
                            country: user.country || '',
                            state: user.state || '',
                            profilePhoto: user.profilePhoto || '',
                            description: user.description || '',
                            shippingAddress: user.shippingAddress || '',
                        };
                        setUserData(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    // Fallback to Redux if API fails
                    if (user) {
                        const data: RegistrationData = {
                            uid: user.id || user.uid,
                            firstName: user.firstName || '',
                            lastName: user.lastName || '',
                            email: user.email || '',
                            phoneNumber: user.phoneNumber || '',
                            address: user.address || '',
                            city: user.city || '',
                            postCode: user.postCode || '',
                            country: user.country || '',
                            state: user.state || '',
                            profilePhoto: user.profilePhoto || '',
                            description: user.description || '',
                            shippingAddress: user.shippingAddress || '',
                        };
                        setUserData(data);
                    }
                }
            }
        };

        fetchUserData();
    }, [isAuthenticated, user, router]);

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
                                                <p>{userData?.description || 'No description available'}</p>
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
                                                <h6>Contact Number</h6>
                                                <ul>
                                                    <li><strong>Phone Number : </strong>{userData?.phoneNumber}</li>
                                                </ul>
                                            </div>
                                        </Col>
                                        <Col md={6} sm={12} className="mb-24">
                                            <div className="bb-vendor-detail-block">
                                                <h6>Address</h6>
                                                <ul>
                                                    <li><strong>Home : </strong>{userData?.address ? `${userData.address}, ${userData.city}, ${userData.state}, ${userData.postCode}, ${userData.country}` : 'Not Provided'}</li>
                                                </ul>
                                            </div>
                                        </Col>
                                        <Col md={6} sm={12} className="mb-24">
                                            <div className="bb-vendor-detail-block">
                                                <h6>Shipping Address</h6>
                                                <ul>
                                                    <li><strong>Office : </strong>{userData?.shippingAddress || 'Not Provided'}</li>
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
