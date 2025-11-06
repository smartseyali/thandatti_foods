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
    const Categories: any = [
        {
            groupname: "Snacks",
            categoryName: [
                "Snacks",
                "Juice",
                "Chips",
                "Spices",
                "Sauces"
            ],
        },
        {
            groupname: "Fruit",
            categoryName: [
                "Fruit"
            ],
        },
        {
            groupname: "Vegetable",
            categoryName: [
                "Vegetable",
                "Tuber Root",
                "Leaves",
            ],
        },
    ]

    const { data, error } = useSWR("/api/all-product", fetcher, { onSuccess, onError });

    const handleProductClick = (index: number) => {
        setSelectedIndex(index);
    };
    if (error) return <div>Failed to load products</div>;
    if (!data) return <div></div>

    const filterByAll = () => {
        return data && data.length > 0 ? data
        .map((item:any) => ({ item, sort: Math.random() }))
        .sort((a:any, b:any) => a.sort - b.sort)
        .map(({ item }: any) => item)
        .slice(0, 12): [];
    };

    const filterByCategory = (category: string) => {
        return data && data.length > 0 ? data
        .filter((product: any) =>
            Categories.find((cat: any) =>
                cat.groupname === category && cat.categoryName.includes(product.category)
            )
        ): [];
    };

    return (
        <section className="section-product-tabs padding-tb-50">
            <div className="container">
                <Tabs>
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
                                            <Tab
                                                style={{ outline: "none" }}
                                                className="nav-item"
                                                key={"snack"}>
                                                <a className={`nav-link ${selectedIndex == 1 ? "active" : ""}`} onClick={() => handleProductClick(1)} data-bs-toggle="tab">Snack & Spices</a>
                                            </Tab>
                                            <Tab
                                                style={{ outline: "none" }}
                                                className="nav-item"
                                                key={"fruit"}>
                                                <a className={`nav-link ${selectedIndex == 2 ? "active" : ""}`} onClick={() => handleProductClick(2)}>Fruits</a>
                                            </Tab>
                                            <Tab
                                                style={{ outline: "none" }}
                                                className="nav-item"
                                                key={"veg"}>
                                                <a className={`nav-link ${selectedIndex == 3 ? "active" : ""}`} onClick={() => handleProductClick(3)}>Vegetables</a>
                                            </Tab>
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
                                <TabPanel className={`tab-pane fade ${selectedIndex === 0 ? "show active" : ""}`} id="all">
                                    <Row>
                                        <Fade triggerOnce direction='up' duration={1000} delay={200} className="col-xl-3 col-md-4 col-6 mb-24 bb-product-box" data-aos="fade-up"
                                            data-aos-duration="1000" data-aos-delay="200">
                                            {filterByAll().map((data: any, index: any) => (
                                                <ProductItemCard data={data} key={index} />
                                            ))}
                                        </Fade>
                                    </Row>
                                </TabPanel>
                                {Categories.map((category: any, idx: number) => (
                                    <TabPanel key={idx} className={`tab-pane fade ${selectedIndex === idx + 1 ? "show active" : ""}`} id={category.groupname.toLowerCase()}>
                                        <Row>
                                            <Fade triggerOnce direction="up" duration={1000} delay={200} className="col-xl-3 col-md-4 col-6 mb-24 bb-product-box">
                                                {filterByCategory(category.groupname).map((product: any, index: number) => (
                                                    <ProductItemCard data={product} key={index} />
                                                ))}
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
