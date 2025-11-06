"use client"
import React from 'react'
import { Fade } from 'react-awesome-reveal'
import { showSuccessToast } from '../toast-popup/Toastify'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/loginSlice'
import { Formik, FormikHelpers, FormikProps } from "formik";
import * as yup from "yup";
import { Col, Form, InputGroup, Row } from 'react-bootstrap';

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    postCode: string;
    conformPassword: string;
    country: string;
    state: string;
    city: string;
}

const Register = () => {
    const router = useRouter()
    const dispatch = useDispatch();

    const schema = yup.object().shape({
        email: yup.string().required(),
        password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        conformPassword: yup.string().min(6, "Conform Password must be at least 6 characters").required("Password is required"),
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        phoneNumber: yup.string().min(10, "Conform Password must be at least 6 characters").required(),
        address: yup.string().required(),
        postCode: yup.string().min(6, "Conform Password must be at least 6 characters").required(),
        country: yup.string().required(),
        state: yup.string().required(),
        city: yup.string().required(),
    });

    const initialValues: FormValues = {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        city: "",
        postCode: "",
        country: "",
        state: "",
        password: "",
        conformPassword: "",
    };

    const handleSubmit = (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
        formikHelpers.setSubmitting(false);

        const uniqueId = `${Date.now()}`;
        const newRegistration = { ...values, uid: uniqueId };
        const existingRegistrations = JSON.parse(localStorage.getItem("registrationData") || "[]");

        if (typeof window !== "undefined") {
            localStorage.setItem("registrationData", JSON.stringify([...existingRegistrations, newRegistration]));
            localStorage.setItem("login_user", JSON.stringify(newRegistration));
            dispatch(login(newRegistration))
            router.push("/");
        }

        formikHelpers.resetForm();
        showSuccessToast("Registration successful!")
    }
    return (
        <>
            <section className="section-register padding-tb-50">
                <div className="container">
                    <Row>
                        <Col>
                            <Fade triggerOnce direction='up' duration={1000} delay={200} className="bb-register" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                                <Row>
                                    <Col sm={12}>
                                        <div className="section-title bb-center">
                                            <div className="section-detail">
                                                <h2 className="bb-title">Register</h2>
                                                <p>Best place to buy and sell digital products</p>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        <Formik
                                            validationSchema={schema}
                                            onSubmit={handleSubmit}
                                            initialValues={initialValues}

                                        >{({
                                            setFieldValue,
                                            handleSubmit,
                                            handleChange,
                                            values,
                                            errors,
                                        }: FormikProps<FormValues>) => {
                                            return (
                                                <Form noValidate onSubmit={handleSubmit} method="post">
                                                    <div className="bb-register-wrap bb-register-width-50">
                                                        <label>First Name*</label>
                                                        <Form.Group>
                                                            <InputGroup>
                                                                <Form.Control value={values.firstName} onChange={handleChange} type="text" name="firstName" placeholder="Enter your first name" required isInvalid={!!errors.firstName} />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.firstName}
                                                                </Form.Control.Feedback>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="bb-register-wrap bb-register-width-50">
                                                        <label>Last Name*</label>
                                                        <Form.Group>
                                                            <InputGroup>
                                                                <Form.Control value={values.lastName} onChange={handleChange} isInvalid={!!errors.lastName} type="text" name="lastName" placeholder="Enter your Last name" required />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.lastName}
                                                                </Form.Control.Feedback>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </div>

                                                    <div className="bb-register-wrap bb-register-width-50">
                                                        <label>Email*</label>
                                                        <Form.Group>
                                                            <InputGroup>
                                                                <Form.Control value={values.email} onChange={handleChange} isInvalid={!!errors.email} type="email" name="email" placeholder="Enter your Email" required />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.email}
                                                                </Form.Control.Feedback>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="bb-register-wrap bb-register-width-50">
                                                        <label>Phone Number*</label>
                                                        <Form.Group>
                                                            <InputGroup>
                                                                <Form.Control value={values.phoneNumber} onChange={handleChange} isInvalid={!!errors.phoneNumber} type="text" name="phoneNumber" placeholder="Enter your phone number" required />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.phoneNumber}
                                                                </Form.Control.Feedback>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="bb-register-wrap bb-register-width-50">

                                                        <label>Password*</label>
                                                        <Form.Group>
                                                            <InputGroup>
                                                                <Form.Control value={values.password} onChange={handleChange} isInvalid={!!errors.password} type="password" name="password" placeholder="Enter your phone number" required />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.password}
                                                                </Form.Control.Feedback>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="bb-register-wrap bb-register-width-50">
                                                        <label>Conform Password*</label>
                                                        <Form.Group>
                                                            <InputGroup>
                                                                <Form.Control value={values.conformPassword} onChange={handleChange} isInvalid={!!errors.conformPassword} type="password" name="conformPassword" placeholder="Enter your phone number" required />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.conformPassword}
                                                                </Form.Control.Feedback>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="bb-register-wrap bb-register-width-100">

                                                        <label>Address*</label>
                                                        <Form.Group>
                                                            <InputGroup>
                                                                <Form.Control value={values.address} onChange={handleChange} isInvalid={!!errors.address} type="text" name="address" placeholder="Address Line 1" required />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.address}
                                                                </Form.Control.Feedback>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="bb-register-wrap bb-register-width-50">
                                                        <label>Country*</label>
                                                        <Form.Group >
                                                            <InputGroup>
                                                                <Form.Select value={values.country} isInvalid={!!errors.country} onChange={handleChange} name='country' className="custom-select" required>
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
                                                    </div>
                                                    <div className="bb-register-wrap bb-register-width-50">
                                                        <label>Region State*</label>
                                                        <Form.Group >
                                                            <InputGroup>
                                                                <Form.Select value={values.state} isInvalid={!!errors.state} onChange={handleChange} name='state' className="custom-select" required>
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
                                                    </div>
                                                    <div className="bb-register-wrap bb-register-width-50">
                                                        <label>City*</label>
                                                        <Form.Group >
                                                            <InputGroup>
                                                                <Form.Select value={values.city} isInvalid={!!errors.city} name='city' onChange={handleChange} className="custom-select" required>
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
                                                    </div>
                                                    <div className="bb-register-wrap bb-register-width-50">

                                                        <label>Post Code*</label>
                                                        <Form.Group>
                                                            <InputGroup>
                                                                <Form.Control value={values.postCode} onChange={handleChange} isInvalid={!!errors.postCode} type="text" name="postCode" placeholder="Post Code" required />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.postCode}
                                                                </Form.Control.Feedback>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="bb-register-button">
                                                        <button type="submit" className="bb-btn-2">Register</button>
                                                    </div>
                                                </Form>
                                            )
                                        }}
                                        </Formik>
                                    </Col>
                                </Row>
                            </Fade>
                        </Col>
                    </Row>
                </div>
            </section>
        </>
    )
}

export default Register;

export const getRegistrationData = () => {
    if (typeof window !== "undefined") {
        const registrationData = localStorage.getItem("registrationData");
        return registrationData ? JSON.parse(registrationData) : [];
    }
    return [];
};

export const setRegistrationData = (data: any) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("registrationData", JSON.stringify(data));
    }
};
