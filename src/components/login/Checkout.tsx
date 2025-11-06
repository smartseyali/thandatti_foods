"use client"
import { RootState } from '@/store';
import React, { useEffect, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { useDispatch, useSelector } from 'react-redux';
import DiscountCoupon from '../discount-coupon/DiscountCoupon';
import StarRating from '../stars/StarRating';
import { useRouter } from 'next/navigation';
import { showErrorToast, showSuccessToast } from '../toast-popup/Toastify';
import { Formik, FormikHelpers, FormikProps } from "formik";
import * as yup from "yup";
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import { addOrder, clearCart, setOrders } from '@/store/reducer/cartSlice';
import { login } from '@/store/reducer/loginSlice';

interface FormValues {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    postCode: string;
    country: string;
    state: string;
    city: string;
}
interface userValues {
    email: string;
    password: string;
}
interface Registration {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    postCode: string;
    country: string;
    state: string;
    password: string;
    uid: any;
}

interface Option {
    value: string;
    tooltip: string;
}

const Checkout = () => {
    const isAuthenticated = useSelector((state: RootState) => state.login.isAuthenticated);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const router = useRouter()
    const dispatch = useDispatch()
    const cartSlice = useSelector((state: RootState) => state.cart?.items);
    const orders = useSelector((state: RootState) => state.cart.orders);
    const [subTotal, setSubTotal] = useState(0);
    const [vat, setVat] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [selectedMethod, setSelectedMethod] = useState("free");
    const [checkOutMethod, setCheckOutMethod] = useState("guest");
    const [billingAddressMethod, setBillingAddressMethod] = useState("new");
    const [loginVisible, setLoginVisible] = useState(false);
    const [btnVisible, setBtnVisible] = useState(false);
    const [textVisible, setTextVisible] = useState(false);
    const [billingVisible, setBillingVisible] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState<FormValues | null>(null);
    const [addressVisible, setAddressVisible] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState<{ [key: number]: number }>({})

    const options: Option[] = [
        { value: '250g', tooltip: 'Small' },
        { value: '500g', tooltip: 'Medium' },
        { value: '1kg', tooltip: 'Large' },
    ];

    const handleClick = (index: any, optionIndex: any) => {
        setActiveIndex({
            ...activeIndex,
            [index]: optionIndex,
        });
    };

    useEffect(() => {
        const defaultSelections = cartSlice.reduce((acc, _, index) => {
            acc[index] = 0;
            return acc;
        }, {} as { [key: number]: number });

        setActiveIndex(defaultSelections);
    }, [cartSlice]);

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

    const discountAmount = subTotal * (discount / 100);
    const total = subTotal + vat - discountAmount;

    useEffect(() => {
        const existingAddresses = JSON.parse(
            localStorage.getItem("shippingAddresses") || "[]"
        );
        setAddressVisible(existingAddresses);

        if (existingAddresses.length > 0 && !selectedAddress) {
            setSelectedAddress(existingAddresses[0]);
        }
    }, [selectedAddress]);

    useEffect(() => {

        if (selectedAddress) {
            setBillingAddressMethod("use");
        } else {
            setBillingAddressMethod("new");
        }
    }, [selectedAddress]);

    //login
    useEffect(() => {
        const storedRegistration = JSON.parse(localStorage.getItem("registrationData") || '[]');
        setRegistrations(storedRegistration)
    }, [])

    //login end
    const generateRandomId: any = () => {
        const randomNum = Math.floor(Math.random() * 100000);
        return `${randomNum}`;
    };

    const randomId = generateRandomId();

    const handleCheckout = () => {

        if (!selectedAddress) {
            showErrorToast("Please select a billing address.");
            return;
        }

        const newOrder = {
            orderId: randomId,
            date: new Date().getTime(),
            shippingMethod: selectedMethod,
            totalItems: cartSlice.length,
            totalPrice: total,
            status: "Pending",
            products: cartSlice,
            address: selectedAddress,
        };

        const orderExists = orders.some(
            (order: any) => order.id === newOrder.orderId
        );

        if (!orderExists) {
            dispatch(addOrder(newOrder));
        } else {
            console.log(
                `Order with ID ${newOrder.orderId} already exists and won't be added again.`
            );
        }
        dispatch(clearCart());

        const loginUser = JSON.parse(localStorage.getItem("login_user") || "{}");
        if (loginUser?.uid) {
            router.push("/orders");
        } else {
            console.info("User is not logged in or missing user ID.");
        }
    };

    const handleDiscountApplied = (discount: any) => {
        setDiscount(discount);
    };

    const handleDeliveryChange = (event: any) => {
        setSelectedMethod(event.target.value);
    };
    const handleBillingAddressChange = (event: any) => {
        const addressMethod = event.target.value
        setBillingAddressMethod(addressMethod);
    };
    const handleCheckOutChange = (event: any) => {
        const method = event.target.value
        setCheckOutMethod(method);

        if (method === "guest") {
            setBtnVisible(false)
            setTextVisible(false)
            setLoginVisible(false)
            setBillingVisible(true)
        }

        if (method === "register") {
            setBtnVisible(true)
            setTextVisible(true)
            setLoginVisible(false)
            setBillingVisible(false)
        }
        if (method === "login") {
            setBtnVisible(false)
            setTextVisible(false)
            setBillingVisible(false)
            setLoginVisible(true)
        }
    };

    const handleContinueBtn = () => {
        if (checkOutMethod === "register") {
            router.push("/register");
        }
    };

    const handleSelectAddress = (address: FormValues) => {
        console.log("Selected Address:", address);
        console.log("Selected selectedAddress:", selectedAddress);
        setSelectedAddress(address);
    };
    const handleRemoveAddress = (index: number) => {
        const updatedAddresses = addressVisible.filter((_, i) => i !== index);
        localStorage.setItem("shippingAddresses", JSON.stringify(updatedAddresses));
        setAddressVisible(updatedAddresses);

        if (selectedAddress && selectedAddress.id === addressVisible[index].id) {
            setSelectedAddress(null);
            localStorage.removeItem('selectedAddress');
        }
    };

    // billing address
    const schema = yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        address: yup.string().required(),
        postCode: yup.string().min(5).max(6).required(),
        country: yup.string().required(),
        state: yup.string().required(),
        city: yup.string().required(),
    });

    const initialValues: FormValues = {
        id: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postCode: "",
        country: "",
        state: "",
    };

    const handleSubmit = (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
        formikHelpers.setSubmitting(false);

        values.id = `${Date.now()}`;
        const existingAddresses = JSON.parse(
            localStorage.getItem("shippingAddresses") || "[]"
        );
        const updatedAddresses = [...existingAddresses, values];
        localStorage.setItem("shippingAddresses", JSON.stringify(updatedAddresses));
        setAddressVisible(updatedAddresses);
        setSelectedAddress(values);
        setBillingAddressMethod("use")
        formikHelpers.setSubmitting(false);
        formikHelpers.resetForm();
    }
    // user login

    const UserSchema = yup.object().shape({
        email: yup.string().required(),
        password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    })

    const initialUserValues: userValues = {
        email: "",
        password: "",
    }

    const handleLoginBtn = (values: userValues, formikHelpers: FormikHelpers<userValues>) => {
        formikHelpers.setSubmitting(false);
        const loginUser = registrations.find((user) => user.email === values.email && user.password === values.password)
        if (loginUser) {
            const findUser = { uid: loginUser.uid, email: values.email, password: values.password }
            localStorage.setItem("login_user", JSON.stringify(findUser));
            dispatch(login(loginUser))
            showSuccessToast("User login successfull!")
            setCheckOutMethod("guest")
            setBillingVisible(true)
            setLoginVisible(false)
        } else {
            showErrorToast("Invalid email and password")
        }
        formikHelpers.resetForm();
    }

    return (
        <>
            <section className="section-checkout padding-tb-50">
                <div className="container">
                    <Row className="mb-minus-24">
                        <Col lg={4} sm={12} className="mb-24">
                            <div className="bb-checkout-sidebar">
                                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                                    <div className="checkout-items">
                                        <div className="sub-title">
                                            <h4>summary</h4>
                                        </div>
                                        <div className="checkout-summary">
                                            <ul>
                                                <li><span className="left-item">sub-total</span><span>₹{subTotal.toFixed(2)}</span></li>
                                                <li><span className="left-item">Delivery Charges</span><span>₹{vat.toFixed(2)}</span></li>
                                                <li>
                                                    <span className="left-item">Coupon Discount</span>
                                                    <span><a onClick={(e) => e.preventDefault()} href="#" className="apply drop-coupon">Apply Coupon</a></span>
                                                </li>
                                                <DiscountCoupon onDiscountApplied={handleDiscountApplied} />
                                            </ul>
                                            <div className="summary-total">
                                                <ul>
                                                    <li><span className="text-left">Total Amount</span><span className="text-right">₹{total.toFixed(2)}</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="bb-checkout-pro">
                                            {cartSlice.map((data: any, index: any) => (
                                                <div key={index} className="pro-items">
                                                    <div className="image">
                                                        <img src={data.image} alt="new-product-1" />
                                                    </div>
                                                    <div className="items-contact">
                                                        <h4><a onClick={(e) => e.preventDefault()} href="#">{data.title}</a></h4>
                                                        <span className="bb-pro-rating">
                                                            <StarRating rating={data.rating} />
                                                        </span>
                                                        <div className="inner-price">
                                                            <span className="new-price">₹{data.newPrice}</span>
                                                            <span className="old-price">₹{data.oldPrice}</span>
                                                        </div>
                                                        <div className="bb-pro-variation">
                                                            <ul>
                                                                {options.map((data, optionIndex) => (
                                                                    <li key={optionIndex} className={activeIndex[index] === optionIndex ? "active" : ""}>
                                                                        <a onClick={(e) => { e.preventDefault(); handleClick(index, optionIndex) }} href="#" className="bb-opt-sz"
                                                                            data-tooltip={data.tooltip}>{data.value}</a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Fade>
                                <Fade triggerOnce direction='up' duration={1000} delay={400} >
                                    <div className="checkout-items" >
                                        <div className="checkout-method">
                                            <div className="sub-title">
                                                <h4>Delivery Method</h4>
                                            </div>
                                            <span className="details">Please select the preferred shipping method to use on this
                                                order.</span>
                                            <div className="bb-del-option">
                                                <div className="inner-del">
                                                    <span className="bb-del-head">Free Shipping</span>
                                                    <div className="radio-itens">
                                                        <input checked={selectedMethod === "free"} onChange={handleDeliveryChange} value="free" type="radio" id="rate1" name="rate" />
                                                        <label htmlFor="rate1">Rate - ₹0 .00</label>
                                                    </div>
                                                </div>
                                                <div className="inner-del mb-24">
                                                    <span className="bb-del-head">Flat Rate</span>
                                                    <div className="radio-itens">
                                                        <input checked={selectedMethod === "flat"} onChange={handleDeliveryChange} value="flat" type="radio" id="rate2" name="rate" />
                                                        <label htmlFor="rate2">Rate - ₹5.00</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="about-order ">
                                                <h5>Add Comments About Your Order</h5>
                                                <textarea name="your-commemt" placeholder="Comments"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </Fade>
                                <Fade triggerOnce direction='up' duration={1000} delay={600}  >
                                    <div className="checkout-items">
                                        <div className="sub-title">
                                            <h4>Payment Method</h4>
                                        </div>
                                        <div className="checkout-method">
                                            <span className="details">Please select the preferred shipping method to use on this
                                                order.</span>
                                            <div className="bb-del-option">
                                                <div className="inner-del">
                                                    <div className="radio-itens">
                                                        <input type="radio" id="Cash1" name="radio-itens" />
                                                        <label htmlFor="Cash1">Cash On Delivery</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="about-order">
                                            <h5>Add Comments About Your Order</h5>
                                            <textarea name="your-commemt" placeholder="Comments"></textarea>
                                        </div>
                                    </div>
                                </Fade>
                                <Fade triggerOnce direction='up' duration={1000} delay={800} >
                                    <div className="checkout-items">
                                        <div className="sub-title">
                                            <h4>Payment Method</h4>
                                        </div>
                                        <div className="payment-img">
                                            <img src="/assets/img/payment/payment.png" alt="payment" />
                                        </div>
                                    </div>
                                </Fade>
                            </div>
                        </Col>
                        <Col lg={8} sm={12} className="mb-24">
                            <Fade triggerOnce direction='up' duration={1000} delay={400}>
                                <div className="bb-checkout-contact">
                                    <div className="main-title">
                                        <h4>New Customer</h4>
                                    </div>
                                    {!isAuthenticated ? <>
                                        <label className="inner-title">Checkout Options</label>
                                        <div className="checkout-radio">
                                            <div className="radio-itens">
                                                <input onChange={handleCheckOutChange} checked={checkOutMethod === "guest"} value='guest' type="radio" id="del2" name="account" />
                                                <label htmlFor="del2">Guest Account</label>
                                            </div>
                                            <div className="radio-itens">
                                                <input onChange={handleCheckOutChange} checked={checkOutMethod === "register"} value='register' type="radio" id="del1" name="account" />
                                                <label htmlFor="del1">Register Account</label>
                                            </div>
                                            <div className="radio-itens">
                                                <input disabled={isAuthenticated} onChange={handleCheckOutChange} checked={checkOutMethod === "login"} value='login' type="radio" id="del3" name="account" />
                                                <label htmlFor="del3">Login Account</label>
                                            </div>
                                        </div>
                                    </>:<></>}
                                    {textVisible && (
                                        <p>By creating an account you will be able to shop faster, be up to date on an orders status,
                                            and keep track of the orders you have previously made.</p>
                                    )}
                                    {btnVisible && (
                                        <div className="inner-button">
                                            <a onClick={handleContinueBtn} className="bb-btn-2">Continue</a>
                                        </div>
                                    )}
                                    {loginVisible && (
                                        <>
                                            <Formik
                                                onSubmit={handleLoginBtn}
                                                validationSchema={UserSchema}
                                                initialValues={initialUserValues}
                                            >{({
                                                handleSubmit,
                                                handleChange,
                                                values,
                                                errors,
                                            }: FormikProps<userValues>) => {
                                                return (
                                                    <Form onSubmit={handleSubmit} method="post">
                                                        <div className="input-item">
                                                            <label>Email Address</label>
                                                            <Form.Group>
                                                                <InputGroup>
                                                                    <Form.Control onChange={handleChange} value={values.email} type="email" id="email" name="email" placeholder="Enter Your Email" isInvalid={!!errors.email} />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {errors.email}
                                                                    </Form.Control.Feedback>
                                                                </InputGroup>
                                                            </Form.Group>
                                                        </div>
                                                        <div className="input-item">
                                                            <label>Password</label>
                                                            <Form.Group>
                                                                <InputGroup>
                                                                    <Form.Control value={values.password} onChange={handleChange} type="password" name="password" placeholder="Enter your password" isInvalid={!!errors.password} />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {errors.password}
                                                                    </Form.Control.Feedback>
                                                                </InputGroup>
                                                            </Form.Group>
                                                        </div>

                                                        <div className="input-button">
                                                            <div>
                                                                <button type="submit" className="bb-btn-2">Login</button>
                                                            </div>
                                                        </div>
                                                    </Form>
                                                )
                                            }}
                                            </Formik>
                                        </>
                                    )}
                                    {billingVisible && (
                                        <>
                                            <div className="main-title">
                                                <h4>Billing Details</h4>
                                            </div>
                                            <div className="checkout-radio">
                                                <div className="radio-itens">
                                                    <input disabled={addressVisible.length === 0} onChange={handleBillingAddressChange} checked={billingAddressMethod === "use"} value="use" type="radio" id="address1" name="address" />
                                                    <label htmlFor="address1">I want to use an existing address</label>
                                                </div>
                                                <div className="radio-itens">
                                                    <input onChange={handleBillingAddressChange} checked={billingAddressMethod === "new" || addressVisible.length === 0} value="new" type="radio" id="address2" name="address" />
                                                    <label htmlFor="address2">I want to use new address</label>
                                                </div>
                                            </div>
                                            <div className="input-box-form">
                                                {billingAddressMethod === "new" || addressVisible.length === 0 ? (
                                                    <Formik
                                                        validationSchema={schema}
                                                        onSubmit={handleSubmit}
                                                        initialValues={initialValues}

                                                    >{({
                                                        handleSubmit,
                                                        handleChange,
                                                        values,
                                                        errors,
                                                    }: FormikProps<FormValues>) => {
                                                        return (
                                                            <Form onSubmit={handleSubmit} method="post">
                                                                <Row>
                                                                    <Col lg={6} sm={12}>
                                                                        <Form.Group className="input-item">
                                                                            <label>First Name *</label>
                                                                            <InputGroup>
                                                                                <Form.Control onChange={handleChange} value={values.firstName} isInvalid={!!errors.firstName} type="text" name="firstName" placeholder="Enter your First Name" />
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {errors.firstName}
                                                                                </Form.Control.Feedback>
                                                                            </InputGroup>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg={6} sm={12}>
                                                                        <Form.Group className="input-item">
                                                                            <label>Last Name *</label>
                                                                            <InputGroup>
                                                                                <Form.Control onChange={handleChange} value={values.lastName} isInvalid={!!errors.lastName} type="text" name="lastName" placeholder="Enter your Last Name" />
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {errors.lastName}
                                                                                </Form.Control.Feedback>
                                                                            </InputGroup>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col sm={12}>
                                                                        <Form.Group className="input-item">
                                                                            <label>Address *</label>
                                                                            <InputGroup>
                                                                                <Form.Control onChange={handleChange} value={values.address} isInvalid={!!errors.address} type="text" name="address" placeholder="Address Line 1" />
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {errors.address}
                                                                                </Form.Control.Feedback>
                                                                            </InputGroup>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg={6} sm={12}>
                                                                        <Form.Group className="input-item">
                                                                            <label>Country *</label>
                                                                            <InputGroup>
                                                                                <Form.Select onChange={handleChange} value={values.country} isInvalid={!!errors.country} name='country' className="custom-select">
                                                                                    <option value='' disabled>Country</option>
                                                                                    <option value="india">India</option>
                                                                                    <option value="chile">Chile</option>
                                                                                    <option value="egypt">Egypt</option>
                                                                                    <option value="italy">Italy</option>
                                                                                    <option value="yemen">Yemen</option>
                                                                                </Form.Select>
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {errors.country}
                                                                                </Form.Control.Feedback>
                                                                            </InputGroup>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg={6} sm={12}>
                                                                        <Form.Group className="input-item">
                                                                            <label>Region State *</label>
                                                                            <InputGroup>
                                                                                <Form.Select onChange={handleChange} value={values.state} isInvalid={!!errors.state} name='state' className="custom-select">
                                                                                    <option value='' disabled>State</option>
                                                                                    <option value="gujarat">Gujarat</option>
                                                                                    <option value="goa">Goa</option>
                                                                                    <option value="hariyana">Hariyana</option>
                                                                                    <option value="mumbai">Mumbai</option>
                                                                                    <option value="delhi">Delhi</option>
                                                                                </Form.Select>
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {errors.state}
                                                                                </Form.Control.Feedback>
                                                                            </InputGroup>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg={6} sm={12}>
                                                                        <Form.Group className="input-item">
                                                                            <label>City *</label>
                                                                            <InputGroup>
                                                                                <Form.Select onChange={handleChange} value={values.city} isInvalid={!!errors.city} name='city' className="custom-select">
                                                                                    <option value='' disabled>City</option>
                                                                                    <option value="surat">Surat</option>
                                                                                    <option value="bhavnagar">Bhavnagar</option>
                                                                                    <option value="amreli">Amreli</option>
                                                                                    <option value="rajkot">Rajkot</option>
                                                                                    <option value="amdavad">Amdavad</option>
                                                                                </Form.Select>
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {errors.city}
                                                                                </Form.Control.Feedback>
                                                                            </InputGroup>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg={6} sm={12}>
                                                                        <Form.Group className="input-item">
                                                                            <label>Post Code *</label>
                                                                            <InputGroup>
                                                                                <Form.Control onChange={handleChange} value={values.postCode} isInvalid={!!errors.postCode} type="text" name="postCode" placeholder="Post Code" />
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {errors.postCode}
                                                                                </Form.Control.Feedback>
                                                                            </InputGroup>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col sm={12}>
                                                                        <div className="input-button">
                                                                            <button type="submit" className="bb-btn-2">Add</button>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </Form>
                                                        )
                                                    }}
                                                    </Formik>
                                                ) : (
                                                    <>
                                                        {billingAddressMethod === "use" &&
                                                            addressVisible.length > 0 && (
                                                                <>
                                                                    {addressVisible.map((address, index) => (
                                                                        <div key={address.id} style={{ marginTop: "24px" }} className="bb-inner-tabs">
                                                                            <div style={{ display: "flex", justifyContent: "space-between", margin: "0 10px", cursor: "pointer" }} className="information" onClick={() => handleSelectAddress(address)}>
                                                                                <div className="bb-sidebar-block-item">
                                                                                    <input onChange={() => handleSelectAddress(address)}
                                                                                        checked={selectedAddress !== null && selectedAddress.id === address.id}
                                                                                        name="selectedAddress"
                                                                                        type="checkbox" />
                                                                                    <span className="checked"></span>
                                                                                </div>
                                                                                <div className='address-box'>
                                                                                    <ul>
                                                                                        <li><span>Name</span> {address.firstName} {address.lastName}</li>
                                                                                        <li><span>Address</span>{address.address}</li>
                                                                                        <li><span>PostCode</span> {address.postCode}</li>
                                                                                    </ul>
                                                                                    <ul>
                                                                                        <li><span>City</span>{address.city}</li>
                                                                                        <li><span>State</span>{address.state}</li>
                                                                                        <li><span>Country</span> {address.country}</li>
                                                                                    </ul>
                                                                                </div>
                                                                                <div >
                                                                                    <a className="cart-remove-item"><i onClick={() => handleRemoveAddress(index)} className="ri-close-line"></i></a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    <div style={{ marginTop: "24px" }} className="col-12">
                                                                        <div className="input-button">
                                                                            <button onClick={handleCheckout} type="button" className="bb-btn-2">Place Order</button>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Fade>
                        </Col>
                    </Row>
                </div>
            </section>
        </>
    )
}

export default Checkout

export const useLoadOrders = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const loginUser = JSON.parse(localStorage.getItem("login_user") || "{}");
            if (loginUser?.uid) {
                const storedOrders = JSON.parse(localStorage.getItem("orders") || "{}");
                const userOrders = storedOrders[loginUser.uid] || [];
                if (userOrders.length > 0) {
                    dispatch(setOrders(userOrders));
                }
            }
        }
    }, [dispatch]);
};