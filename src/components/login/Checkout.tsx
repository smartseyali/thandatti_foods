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
import { useLoadOrders } from '@/hooks/useOrders';
import { login } from '@/store/reducer/loginSlice';
import { getAttributionForConversion } from '@/utils/attribution';
import PaymentGateway from '../payment/PaymentGateway';
import { orderApi, addressApi, locationApi } from '@/utils/api';
import { cartApi } from '@/utils/api';
import { authStorage } from '@/utils/authStorage';

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
    phoneNumber: string;
    password: string;
}
interface Registration {
    firstName: string;
    lastName: string;
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
    const [activeIndex, setActiveIndex] = useState<{ [key: number]: number }>({});
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [selectedCountryId, setSelectedCountryId] = useState<string>('');
    const [selectedStateId, setSelectedStateId] = useState<string>('');

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

    // Load countries on mount
    useEffect(() => {
        const loadCountries = async () => {
            try {
                const countriesData = await locationApi.getCountries();
                setCountries(countriesData);
            } catch (error) {
                console.error('Error loading countries:', error);
            }
        };
        loadCountries();
    }, []);

    // Load states when country is selected
    useEffect(() => {
        const loadStates = async () => {
            if (selectedCountryId) {
                try {
                    const statesData = await locationApi.getStates(selectedCountryId);
                    setStates(statesData);
                    setCities([]); // Clear cities when country changes
                    setSelectedStateId('');
                } catch (error) {
                    console.error('Error loading states:', error);
                }
            } else {
                setStates([]);
                setCities([]);
            }
        };
        loadStates();
    }, [selectedCountryId]);

    // Load cities when state is selected
    useEffect(() => {
        const loadCities = async () => {
            if (selectedStateId) {
                try {
                    const citiesData = await locationApi.getCities(selectedStateId);
                    setCities(citiesData);
                } catch (error) {
                    console.error('Error loading cities:', error);
                }
            } else {
                setCities([]);
            }
        };
        loadCities();
    }, [selectedStateId]);

    // Load existing addresses from database when user is authenticated
    useEffect(() => {
        const loadAddresses = async () => {
            if (isAuthenticated) {
                try {
                    const addresses = await addressApi.getAll();
                    // Map addresses to frontend format
                    const mappedAddresses = addresses.map((addr: any) => ({
                        id: addr.id,
                        firstName: addr.first_name || addr.firstName,
                        lastName: addr.last_name || addr.lastName,
                        address: addr.address_line || addr.addressLine || addr.address,
                        city: addr.city,
                        postCode: addr.postal_code || addr.postalCode || addr.postCode,
                        country: addr.country_name || addr.country || '',
                        state: addr.state_name || addr.state || '',
                        is_default: addr.is_default || false,
                    }));
                    setAddressVisible(mappedAddresses);

                    // Select default address if available and no address is currently selected
                    if (mappedAddresses.length > 0 && !selectedAddress) {
                        const defaultAddress = mappedAddresses.find((addr: any) => addr.is_default) || mappedAddresses[0];
                        setSelectedAddress(defaultAddress);
                        setBillingAddressMethod("use");
                    }
                } catch (error) {
                    console.error('Error loading addresses:', error);
                    setAddressVisible([]);
                }
            } else {
                setAddressVisible([]);
                setSelectedAddress(null);
            }
        };
        loadAddresses();
        // Only reload when authentication status changes, not when selectedAddress changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    useEffect(() => {

        if (selectedAddress) {
            setBillingAddressMethod("use");
        } else {
            setBillingAddressMethod("new");
        }
    }, [selectedAddress]);

    // No longer using localStorage for registration - all data is in database

    // Track begin_checkout when user lands on checkout page
    useEffect(() => {
        if (cartSlice.length > 0 && typeof window !== 'undefined') {
            const attribution = getAttributionForConversion();
            const subtotal = cartSlice.reduce(
                (acc, item) => acc + item.newPrice * item.quantity,
                0
            );

            const items = cartSlice.map((item: any) => ({
                item_id: item.id?.toString() || '',
                item_name: item.title || '',
                item_category: item.category || '',
                price: item.newPrice || 0,
                quantity: item.quantity || 1,
            }));

            // Track begin_checkout in Google Analytics
            if ((window as any).gtag) {
                (window as any).gtag('event', 'begin_checkout', {
                    currency: 'INR',
                    value: subtotal,
                    items: items,
                    source: attribution?.source || 'direct',
                    medium: attribution?.medium || 'none',
                    campaign: attribution?.campaign || '',
                });
            }

            // Track InitiateCheckout in Meta Pixel
            if ((window as any).fbq) {
                (window as any).fbq('track', 'InitiateCheckout', {
                    value: subtotal,
                    currency: 'INR',
                    contents: items,
                    num_items: cartSlice.length,
                    source: attribution?.source || 'direct',
                    medium: attribution?.medium || 'none',
                });
            }
        }
    }, [cartSlice])

    //login end
    const generateRandomId: any = () => {
        const randomNum = Math.floor(Math.random() * 100000);
        return `${randomNum}`;
    };

    const randomId = generateRandomId();

    const handleCheckout = async () => {
        if (!selectedAddress) {
            showErrorToast("Please select a billing address.");
            return;
        }

        if (isCreatingOrder) {
            return;
        }

        try {
            setIsCreatingOrder(true);

            // Check if user is authenticated
            const loginUser = typeof window !== 'undefined' 
                ? authStorage.getUserData()
                : {};

            if (!loginUser?.token) {
                showErrorToast("Please login to place an order.");
                setIsCreatingOrder(false);
                return;
            }

            // Prepare order items
            const items = cartSlice.map((item: any) => ({
                productId: item.productId || item.id,
                quantity: item.quantity || 1,
                price: item.newPrice || 0,
            }));

            // Use address ID from selected address (already saved in database)
            let addressId = selectedAddress.id;
            
            // If address doesn't have a valid UUID, it might be a new address - create it
            // UUIDs are typically 36 characters long with dashes
            if (!addressId || addressId.length < 30) {
                // Create address on backend
                try {
                    // Find country and state IDs if needed
                    const selectedCountry = countries.find(c => c.name === selectedAddress.country || c.id === selectedAddress.country);
                    const selectedState = states.find(s => s.name === selectedAddress.state || s.id === selectedAddress.state);
                    
                    const addressData = {
                        firstName: selectedAddress.firstName,
                        lastName: selectedAddress.lastName,
                        addressLine: selectedAddress.address,
                        city: selectedAddress.city,
                        postalCode: selectedAddress.postCode,
                        state: selectedState?.id || selectedState?.name || selectedAddress.state,
                        stateName: selectedState?.name || selectedAddress.state,
                        country: selectedCountry?.id || selectedCountry?.code || selectedAddress.country,
                        countryName: selectedCountry?.name || selectedAddress.country,
                        addressType: 'billing',
                        isDefault: false,
                    };
                    const createdAddress = await addressApi.create(addressData);
                    addressId = createdAddress.id;
                } catch (error: any) {
                    console.error('Error creating address:', error);
                    showErrorToast("Failed to save address. Please try again.");
                    setIsCreatingOrder(false);
                    return;
                }
            }

            // Create order on backend
            const orderData = {
                shippingAddressId: addressId,
                billingAddressId: addressId,
                shippingMethod: selectedMethod,
                items: items,
                couponCode: discount > 0 ? 'COUPON' : null,
                paymentMethod: paymentMethod,
            };

            const orderResponse = await orderApi.create(orderData);
            const createdOrder = orderResponse.order;

            if (!createdOrder) {
                throw new Error("Failed to create order");
            }

            setCreatedOrderId(createdOrder.id);

            // Get attribution data for conversion tracking
            const attribution = getAttributionForConversion();

            // Track conversion events with attribution
            if (typeof window !== 'undefined') {
                const trackingItems = cartSlice.map((item: any) => ({
                    item_id: item.id?.toString() || '',
                    item_name: item.title || '',
                    item_category: item.category || '',
                    price: item.newPrice || 0,
                    quantity: item.quantity || 1,
                }));

                // Track purchase in Google Analytics
                if ((window as any).gtag) {
                    (window as any).gtag('event', 'purchase', {
                        transaction_id: createdOrder.order_number,
                        value: total,
                        currency: 'INR',
                        items: trackingItems,
                        source: attribution?.source || 'direct',
                        medium: attribution?.medium || 'none',
                        campaign: attribution?.campaign || '',
                        channel: attribution?.channel || 'Direct',
                    });
                }

                // Track purchase in Meta Pixel
                if ((window as any).fbq) {
                    (window as any).fbq('track', 'Purchase', {
                        value: total,
                        currency: 'INR',
                        contents: trackingItems,
                        content_ids: cartSlice.map((item: any) => item.id?.toString() || ''),
                        content_type: 'product',
                        num_items: cartSlice.length,
                        source: attribution?.source || 'direct',
                        medium: attribution?.medium || 'none',
                        campaign: attribution?.campaign || '',
                    });
                }
            }

            // Handle payment method
            if (paymentMethod === 'cod') {
                // For COD, order is created and cart is cleared
                showSuccessToast("Order placed successfully!");
                dispatch(clearCart());
                router.push("/orders");
            } else {
                // For payment gateways, the PaymentGateway component will handle the payment
                showSuccessToast("Order created. Please complete the payment.");
                // PaymentGateway component will handle the rest
            }

        } catch (error: any) {
            console.error('Checkout error:', error);
            showErrorToast(error.message || "Failed to place order. Please try again.");
        } finally {
            setIsCreatingOrder(false);
        }
    };

    const handlePaymentSuccess = (gateway: string, response: any) => {
        showSuccessToast("Payment successful! Order confirmed.");
        dispatch(clearCart());
        router.push("/orders");
    };

    const handlePaymentError = (gateway: string, error: Error) => {
        console.error(`Payment error (${gateway}):`, error);
        showErrorToast(`Payment failed: ${error.message}`);
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
    const handleRemoveAddress = async (addressId: string) => {
        try {
            // Delete address from database
            await addressApi.delete(addressId);
            
            // Update local state
            const updatedAddresses = addressVisible.filter((addr) => addr.id !== addressId);
            setAddressVisible(updatedAddresses);

            // Clear selected address if it was removed
            if (selectedAddress && selectedAddress.id === addressId) {
                setSelectedAddress(null);
                setBillingAddressMethod("new");
            }
            
            showSuccessToast("Address removed successfully!");
        } catch (error: any) {
            console.error('Error removing address:', error);
            showErrorToast(error.message || "Failed to remove address. Please try again.");
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

    const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
        formikHelpers.setSubmitting(true);
        
        try {
            // Find country and state IDs from selected values
            const selectedCountry = countries.find(c => c.name === values.country || c.id === values.country);
            const selectedState = states.find(s => s.name === values.state || s.id === values.state);
            const selectedCity = cities.find(c => c.name === values.city || c.id === values.city);

            // Create address on backend
            const addressData = {
                firstName: values.firstName,
                lastName: values.lastName,
                addressLine: values.address,
                city: selectedCity?.name || values.city,
                postalCode: values.postCode,
                state: selectedState?.id || selectedState?.name || values.state,
                stateName: selectedState?.name || values.state,
                country: selectedCountry?.id || selectedCountry?.code || values.country,
                countryName: selectedCountry?.name || values.country,
                isDefault: addressVisible.length === 0, // Set as default if it's the first address
                addressType: 'billing',
            };

            const createdAddress = await addressApi.create(addressData);
            
            // Update local state
            const newAddress = {
                id: createdAddress.id,
                firstName: createdAddress.first_name || createdAddress.firstName,
                lastName: createdAddress.last_name || createdAddress.lastName,
                address: createdAddress.address_line || createdAddress.addressLine || createdAddress.address,
                city: createdAddress.city,
                postCode: createdAddress.postal_code || createdAddress.postalCode,
                country: createdAddress.country_name || createdAddress.country,
                state: createdAddress.state_name || createdAddress.state,
            };

            const updatedAddresses = [...addressVisible, newAddress];
            setAddressVisible(updatedAddresses);
            setSelectedAddress(newAddress);
            setBillingAddressMethod("use");
            
            showSuccessToast("Address saved successfully!");
            formikHelpers.resetForm();
            
            // Reset location selects
            setSelectedCountryId('');
            setSelectedStateId('');
            setStates([]);
            setCities([]);
        } catch (error: any) {
            console.error('Error saving address:', error);
            showErrorToast(error.message || "Failed to save address. Please try again.");
        } finally {
            formikHelpers.setSubmitting(false);
        }
    }
    // user login

    const UserSchema = yup.object().shape({
        phoneNumber: yup.string()
            .min(10, "Phone number must be at least 10 digits")
            .matches(/^[0-9]+$/, "Phone number must contain only digits")
            .required("Phone Number is required"),
        password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    })

    const initialUserValues: userValues = {
        phoneNumber: "" as string,
        password: "" as string,
    }

    const handleLoginBtn = async (values: userValues, formikHelpers: FormikHelpers<userValues>) => {
        formikHelpers.setSubmitting(true);
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
            
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: values.phoneNumber,
                    password: values.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid phone number or password');
            }

            // Store token securely in sessionStorage
            const { authStorage } = await import('@/utils/authStorage');
            authStorage.setToken(data.token);
            authStorage.setUserData(data.user);

            // Store user data in Redux (without password)
            dispatch(login({
                id: data.user.id,
                email: data.user.email,
                phoneNumber: data.user.phone_number,
                firstName: data.user.first_name,
                lastName: data.user.last_name,
                role: data.user.role || 'customer',
                token: data.token,
            }));

            showSuccessToast("User login successful!");
            formikHelpers.resetForm();
            setCheckOutMethod("guest");
            setBillingVisible(true);
            setLoginVisible(false);
        } catch (error: any) {
            console.error('Login error:', error);
            showErrorToast(error.message || 'Login failed. Please try again.');
            formikHelpers.setSubmitting(false);
        }
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
                                        {createdOrderId && (paymentMethod === 'razorpay' || paymentMethod === 'phonepe') ? (
                                            <div>
                                                <div className="sub-title">
                                                    <h4>Complete Payment</h4>
                                                </div>
                                                <PaymentGateway
                                                    orderId={createdOrderId}
                                                    amount={total}
                                                    currency="INR"
                                                    onPaymentSuccess={handlePaymentSuccess}
                                                    onPaymentError={handlePaymentError}
                                                    selectedMethod={paymentMethod}
                                                    onMethodChange={setPaymentMethod}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <div className="sub-title">
                                                    <h4>Payment Method</h4>
                                                </div>
                                                <div className="checkout-method">
                                                    <span className="details">Please select your preferred payment method.</span>
                                                    <div className="bb-del-option">
                                                        <div className="inner-del">
                                                            <div className="radio-itens">
                                                                <input
                                                                    type="radio"
                                                                    id="Cash1"
                                                                    name="payment-method"
                                                                    checked={paymentMethod === "cod"}
                                                                    onChange={() => setPaymentMethod("cod")}
                                                                />
                                                                <label htmlFor="Cash1">Cash On Delivery</label>
                                                            </div>
                                                        </div>
                                                        <div className="inner-del">
                                                            <div className="radio-itens">
                                                                <input
                                                                    type="radio"
                                                                    id="razorpay1"
                                                                    name="payment-method"
                                                                    checked={paymentMethod === "razorpay"}
                                                                    onChange={() => setPaymentMethod("razorpay")}
                                                                />
                                                                <label htmlFor="razorpay1">Razorpay</label>
                                                            </div>
                                                        </div>
                                                        <div className="inner-del">
                                                            <div className="radio-itens">
                                                                <input
                                                                    type="radio"
                                                                    id="phonepe1"
                                                                    name="payment-method"
                                                                    checked={paymentMethod === "phonepe"}
                                                                    onChange={() => setPaymentMethod("phonepe")}
                                                                />
                                                                <label htmlFor="phonepe1">PhonePe</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="about-order">
                                                    <h5>Add Comments About Your Order</h5>
                                                    <textarea name="your-commemt" placeholder="Comments"></textarea>
                                                </div>
                                            </>
                                        )}
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
                                                            <label>Phone Number</label>
                                                            <Form.Group>
                                                                <InputGroup>
                                                                    <Form.Control onChange={handleChange} value={values.phoneNumber || ""} type="tel" id="phoneNumber" name="phoneNumber" placeholder="Enter Your Phone Number" isInvalid={!!errors.phoneNumber} />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {errors.phoneNumber}
                                                                    </Form.Control.Feedback>
                                                                </InputGroup>
                                                            </Form.Group>
                                                        </div>
                                                        <div className="input-item">
                                                            <label>Password</label>
                                                            <Form.Group>
                                                                <InputGroup>
                                                                    <Form.Control value={values.password || ""} onChange={handleChange} type="password" name="password" placeholder="Enter your password" isInvalid={!!errors.password} />
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
                                                                                <Form.Select 
                                                                                    onChange={(e) => {
                                                                                        handleChange(e);
                                                                                        setSelectedCountryId(e.target.value);
                                                                                        // Reset state and city when country changes
                                                                                        setSelectedStateId('');
                                                                                        setStates([]);
                                                                                        setCities([]);
                                                                                    }} 
                                                                                    value={selectedCountryId || values.country} 
                                                                                    isInvalid={!!errors.country} 
                                                                                    name='country' 
                                                                                    className="custom-select">
                                                                                    <option value='' disabled>Select Country</option>
                                                                                    {countries.map((country) => (
                                                                                        <option key={country.id} value={country.id}>
                                                                                            {country.name}
                                                                                        </option>
                                                                                    ))}
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
                                                                                <Form.Select 
                                                                                    onChange={(e) => {
                                                                                        handleChange(e);
                                                                                        setSelectedStateId(e.target.value);
                                                                                        // Reset city when state changes
                                                                                        setCities([]);
                                                                                    }} 
                                                                                    value={selectedStateId || values.state} 
                                                                                    isInvalid={!!errors.state} 
                                                                                    name='state' 
                                                                                    className="custom-select"
                                                                                    disabled={!selectedCountryId}>
                                                                                    <option value='' disabled>Select State</option>
                                                                                    {states.map((state) => (
                                                                                        <option key={state.id} value={state.id}>
                                                                                            {state.name}
                                                                                        </option>
                                                                                    ))}
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
                                                                                <Form.Select 
                                                                                    onChange={handleChange} 
                                                                                    value={values.city} 
                                                                                    isInvalid={!!errors.city} 
                                                                                    name='city' 
                                                                                    className="custom-select"
                                                                                    disabled={!selectedStateId}>
                                                                                    <option value='' disabled>Select City</option>
                                                                                    {cities.map((city) => (
                                                                                        <option key={city.id} value={city.name}>
                                                                                            {city.name}
                                                                                        </option>
                                                                                    ))}
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
                                                                                    <a className="cart-remove-item"><i onClick={() => handleRemoveAddress(address.id)} className="ri-close-line"></i></a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    <div style={{ marginTop: "24px" }} className="col-12">
                                                                        <div className="input-button">
                                                                            <button 
                                                                                onClick={handleCheckout} 
                                                                                type="button" 
                                                                                className="bb-btn-2"
                                                                                disabled={isCreatingOrder}
                                                                            >
                                                                                {isCreatingOrder ? 'Placing Order...' : 'Place Order'}
                                                                            </button>
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