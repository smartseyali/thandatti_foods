import React from 'react'
import { Fade } from 'react-awesome-reveal'
import { Col, Row } from 'react-bootstrap'
import useSWR from 'swr';
import fetcher from '../fetcher/Fetcher';

const TermsAndConditions = ({
    onSuccess = () => { },
    hasPaginate = false,
    onError = () => { },
}) => {

    const { data, error } = useSWR("/api/term-condition", fetcher, { onSuccess, onError });
    const { data: TermCondition } = useSWR("/api/term-condition-two", fetcher, { onSuccess, onError });

    if (error) return <div>Failed to load products</div>;
    if (!data) return <div></div>

    const getData = () => {
        if (hasPaginate) return data.data;
        else return data;
    };

    if (!TermCondition) return <div></div>

    const getTermData = () => {
        if (hasPaginate) return TermCondition.data;
        else return TermCondition;
    };

    return (
        <>
            <section className="section-terms padding-tb-50">
                <div className="container">
                    <Row>
                        <div className='col-12'>
                            <Fade triggerOnce direction='up' duration={1000} delay={200} className="section-title bb-center" >
                                <div className="section-detail">
                                    <h2 className="bb-title">Terms & <span>Conditions</span></h2>
                                    <p>Customer Terms Conditions.</p>
                                </div>
                            </Fade>
                        </div>
                        <div className="desc">
                            <Row className="row mb-minus-24">
                                <Col lg={6} md={12} className="mb-24">
                                    <Fade triggerOnce direction='up' duration={1000} delay={400}>
                                        <div className="terms-detail">
                                            {getData().map((data: any, index: number) => (
                                                <div key={index} className="block">
                                                    <h3>{data.title}</h3>
                                                    <p>{data.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </Fade>
                                </Col>
                                <Col lg={6} md={12} className="mb-24">
                                    <Fade triggerOnce direction='up' duration={1000} delay={400} >
                                        <div className="terms-detail">
                                            {getTermData().map((data: any, index: any) => (
                                                <div key={index} className="block">
                                                    <h3>{data.title}</h3>
                                                    <p>{data.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </Fade>
                                </Col>
                            </Row>
                        </div>
                    </Row>
                </div>
            </section>
        </>
    )
}

export default TermsAndConditions
