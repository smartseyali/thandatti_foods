"use client"
import React, { useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { Col, Row } from 'react-bootstrap';

const Faq = () => {
    const [activeAccordion, setActiveAccordion] = useState(1);

    const handleAccordionToggle = (index: any) => {
        setActiveAccordion(index === activeAccordion ? null : index);
    };

    return (
        <section className="section-faq padding-tb-50">
            <div className="container">
                <Row className="mb-minus-24">
                    <Col sm={12}>
                        <Fade triggerOnce direction='up' duration={1000} delay={200}>
                            <div className="section-title bb-center">
                                <div className="section-detail">
                                    <h2 className="bb-title">frequently asked <span>questions</span></h2>
                                    <p>Customer service management.</p>
                                </div>
                            </div>
                        </Fade>
                    </Col>
                    <Col lg={4} className="mb-24">
                        <Fade className="bb-faq-img" triggerOnce direction='up' duration={1000} delay={200}>
                            <img src="/assets/img/faq/faq.jpg" alt="faq-img" />
                        </Fade>
                    </Col>
                    <Col lg={8} className="mb-24">
                        <Fade className="bb-faq-contact" triggerOnce direction='up' duration={1000} delay={200}>
                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item">
                                    <h2 onClick={() => handleAccordionToggle(0)} className="accordion-header" id="headingOne">
                                        <button className={`accordion-button ${activeAccordion === 0 ? "" : "collapsed"}`} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            What is the multi vendor services?
                                        </button>
                                    </h2>
                                    <div id="collapseOne" className={`accordion-collapse collapse ${activeAccordion === 0 ? "show" : ""}`}
                                        aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate sint atque
                                            pariatur cupiditate beatae voluptates quidem. Et tenetur autem itaque? Eum
                                            exercitationem assumenda enim eos voluptas. Ad incidunt laborum aliquam,
                                            expedita, voluptatibus quo id adipisci ea ratione ut, dignissimos natus?
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 onClick={() => handleAccordionToggle(1)} className="accordion-header" id="headingTwo">
                                        <button className={`accordion-button ${activeAccordion === 1 ? "" : "collapsed"}`} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                            How to buy many products at a time?
                                        </button>
                                    </h2>
                                    <div id="collapseTwo" className={`accordion-collapse collapse ${activeAccordion === 1 ? "show" : ""}`}
                                        aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate sint atque
                                            pariatur cupiditate beatae voluptates quidem. Et tenetur autem itaque? Eum
                                            exercitationem assumenda enim eos voluptas. Ad incidunt laborum aliquam,
                                            expedita, voluptatibus quo id adipisci ea ratione ut, dignissimos natus?
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 onClick={() => handleAccordionToggle(2)} className="accordion-header" id="headingThree">
                                        <button className={`accordion-button ${activeAccordion === 2 ? "" : "collapsed"}`} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseThree" aria-expanded="false"
                                            aria-controls="collapseThree">
                                            Refund policy for customer
                                        </button>
                                    </h2>
                                    <div id="collapseThree" className={`accordion-collapse collapse ${activeAccordion === 2 ? "show" : ""}`}
                                        aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate sint atque
                                            pariatur cupiditate beatae voluptates quidem. Et tenetur autem itaque? Eum
                                            exercitationem assumenda enim eos voluptas. Ad incidunt laborum aliquam,
                                            expedita, voluptatibus quo id adipisci ea ratione ut, dignissimos natus?
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 onClick={() => handleAccordionToggle(3)} className="accordion-header" id="headingFour">
                                        <button className={`accordion-button ${activeAccordion === 3 ? "" : "collapsed"}`} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseFour" aria-expanded="false"
                                            aria-controls="collapseFour">
                                            Exchange policy for customer
                                        </button>
                                    </h2>
                                    <div id="collapseFour" className={`accordion-collapse collapse ${activeAccordion === 3 ? "show" : ""}`} aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate sint atque
                                            pariatur cupiditate beatae voluptates quidem. Et tenetur autem itaque? Eum
                                            exercitationem assumenda enim eos voluptas. Ad incidunt laborum aliquam,
                                            expedita, voluptatibus quo id adipisci ea ratione ut, dignissimos natus?
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 onClick={() => handleAccordionToggle(4)} className="accordion-header" id="headingFive">
                                        <button className={`accordion-button ${activeAccordion === 4 ? "" : "collapsed"}`} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseFive" aria-expanded="false"
                                            aria-controls="collapseFive">
                                            Give a way products available
                                        </button>
                                    </h2>
                                    <div id="collapseFive" className={`accordion-collapse collapse ${activeAccordion === 4 ? "show" : ""}`} aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate sint atque
                                            pariatur cupiditate beatae voluptates quidem. Et tenetur autem itaque? Eum
                                            exercitationem assumenda enim eos voluptas. Ad incidunt laborum aliquam,
                                            expedita, voluptatibus quo id adipisci ea ratione ut, dignissimos natus?
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 onClick={() => handleAccordionToggle(5)} className="accordion-header" id="headingSix">
                                        <button className={`accordion-button ${activeAccordion === 5 ? "" : "collapsed"}`} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                                            Exchange policy for customer
                                        </button>
                                    </h2>
                                    <div id="collapseSix" className={`accordion-collapse collapse ${activeAccordion === 5 ? "show" : ""}`} aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate sint atque
                                            pariatur cupiditate beatae voluptates quidem. Et tenetur autem itaque? Eum
                                            exercitationem assumenda enim eos voluptas. Ad incidunt laborum aliquam,
                                            expedita, voluptatibus quo id adipisci ea ratione ut, dignissimos natus?
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fade>
                    </Col>
                </Row>
            </div>
        </section>
    )
}

export default Faq
