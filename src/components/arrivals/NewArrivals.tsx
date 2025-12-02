"use client"
import React, { useState } from 'react'
import { Fade } from 'react-awesome-reveal';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import fetcher from '../fetcher/Fetcher';
import useSWR from 'swr';
import ProductItemCard from '../item/ProductItemCard';
import { Row } from 'react-bootstrap';

const NewArrivals = ({
    onSuccess = () => { },
    onError = () => { },
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { data: productsData, error: productsError } = useSWR("/api/all-product?limit=1000", fetcher, { onSuccess, onError });
    const { data: categoriesData, error: categoriesError } = useSWR("/api/category", fetcher);

    const handleProductClick = (index: number) => {
        setSelectedIndex(index);
    };
    
    if (productsError) {
        console.error("Error loading products:", productsError);
        return (
            <section className="section-product-tabs padding-tb-50">
                <div className="container">
                    <Row>
                        <div className='col-12'>
                            <div style={{ padding: '40px', textAlign: 'center' }}>
                                <p>No products available at the moment.</p>
                            </div>
                        </div>
                    </Row>
                </div>
            </section>
        );
    }

    if (!productsData || !categoriesData) return <div></div>
    
    // Ensure data is an array
    const products = Array.isArray(productsData) ? productsData : [];
    const categories = Array.isArray(categoriesData) ? categoriesData : [];

    const filterByAll = () => {
        if (!products || products.length === 0) return [];
        return products
        .map((item:any) => ({ item, sort: Math.random() }))
        .sort((a:any, b:any) => a.sort - b.sort)
        .map(({ item }: any) => item);
    };

    const filterByCategory = (categoryName: string) => {
        if (!products || products.length === 0) return [];
        return products.filter((product: any) => product.category === categoryName);
    };

    return (
        <section className="section-product-tabs padding-tb-50">
            <div className="container">
                <Tabs selectedIndex={selectedIndex} onSelect={index => setSelectedIndex(index)}>
                    <Row>
                        <div className='col-12'>
                            <Fade triggerOnce direction='up' duration={1000} delay={200} >
                                <div className="section-title bb-deal">
                                    <div className="section-detail">
                                        <h2 className="bb-title">New <span>Arrivals</span></h2>
                                        <p>Shop online for new arrivals and get free shipping!</p>
                                    </div>
                                    <TabList className="bb-pro-tab">
                                        <ul className="bb-pro-tab-nav nav">
                                            <Tab
                                                style={{ outline: "none" }}
                                                className="nav-item"
                                                key={"all"}>
                                                <a className={`nav-link ${selectedIndex == 0 ? "active" : ""}`} onClick={() => handleProductClick(0)}>All</a>
                                            </Tab>
                                            {categories.map((cat: any, index: number) => (
                                                <Tab
                                                    style={{ outline: "none" }}
                                                    className="nav-item"
                                                    key={index}>
                                                    <a className={`nav-link ${selectedIndex == index + 1 ? "active" : ""}`} onClick={() => handleProductClick(index + 1)}>{cat.category}</a>
                                                </Tab>
                                            ))}
                                        </ul>
                                    </TabList>
                                </div>
                            </Fade>
                        </div>
                    </Row>
                    <Row className="mb-minus-24">
                        <div className='col-12'>
                            <div className="tab-content">
                                {/* <!-- 1st Product tab start --> */}
                                <TabPanel className={`tab-pane fade ${selectedIndex === 0 ? "show active" : ""}`}>
                                    <Row>
                                        <Fade triggerOnce direction='up' duration={1000} delay={200} className="col-xl-3 col-md-4 col-6 mb-24 bb-product-box" data-aos="fade-up"
                                            data-aos-duration="1000" data-aos-delay="200">
                                            {filterByAll().map((data: any, index: any) => (
                                                <ProductItemCard data={data} key={index} />
                                            ))}
                                        </Fade>
                                    </Row>
                                </TabPanel>
                                {categories.map((cat: any, index: number) => (
                                    <TabPanel key={index} className={`tab-pane fade ${selectedIndex === index + 1 ? "show active" : ""}`}>
                                        <Row>
                                            <Fade triggerOnce direction="up" duration={1000} delay={200} className="col-xl-3 col-md-4 col-6 mb-24 bb-product-box">
                                                {filterByCategory(cat.category).length > 0 ? (
                                                    filterByCategory(cat.category).map((product: any, idx: number) => (
                                                        <ProductItemCard data={product} key={idx} />
                                                    ))
                                                ) : (
                                                    <div className="col-12 text-center">No products found in this category.</div>
                                                )}
                                            </Fade>
                                        </Row>
                                    </TabPanel>
                                ))}
                            </div>
                        </div>
                    </Row>
                </Tabs>
            </div>
        </section>
    )
}

export default NewArrivals
