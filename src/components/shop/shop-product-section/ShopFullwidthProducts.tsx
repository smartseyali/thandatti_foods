import React, { useCallback, useMemo, useState } from 'react'
import useSWR from 'swr';
import fetcher from '@/components/fetcher/Fetcher';
import ShopProductItemCard from '@/components/item/ShopProductItemCard';
import { Fade } from 'react-awesome-reveal';
import ShopFullwidthSidebar from '../sidebar-section/ShopFullwidthSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setRange, setSelectedCategory, setSelectedColor, setSelectedTags, setSelectedWeight, setSortOption } from '@/store/reducer/filterReducer';
import Paginantion from '@/components/paginantion/Paginantion';
import { Col, Row } from 'react-bootstrap';
import Spinner from '@/components/spinner/Spinner';

const ShopFullwidthProducts = ({
    lg,
    col,
    colfive = '',
    width = '',
    itemsPerPage = 12,
}: any) => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [isGridView, setIsGridView] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { selectedCategory, selectedColor, selectedTags, selectedWeight, sortOption, maxPrice, minPrice, range } = useSelector((state: RootState) => state.filter)
    const postData = useMemo(() => ({
        page: currentPage,
        limit: itemsPerPage,
        selectedCategory,
        sortOption,
        selectedWeight,
        selectedColor,
        selectedTags,
        minPrice,
        maxPrice,
        range,
    }), [
        currentPage,
        selectedCategory,
        sortOption,
        selectedWeight,
        selectedColor,
        selectedTags,
        itemsPerPage,
        minPrice,
        maxPrice,
        range,
    ])

    const { data, error } = useSWR(["/api/all-arrivals", postData], ([url, postData]) => fetcher(url, postData));

    const handleSortChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            dispatch(setSortOption(event.target.value));
            setCurrentPage(1);
        },
        [dispatch]
    );

    const handlePriceChange = useCallback(
        (min: number, max: number) => {
            dispatch(setRange({ min, max }));
            setCurrentPage(1);
        },
        [dispatch]
    );

    const handleCategoryChange = (category: any) => {
        const updatedCategory = selectedCategory.includes(category)
            ? selectedCategory.filter((cat) => cat !== category)
            : [...selectedCategory, category];
        dispatch(setSelectedCategory(updatedCategory));
        setCurrentPage(1);
    };

    const handleWeightChange = (weight: any) => {
        const updatedweight = selectedWeight.includes(weight)
            ? selectedWeight.filter((wet) => wet !== weight)
            : [...selectedWeight, weight];
        console.log(updatedweight);
        dispatch(setSelectedWeight(updatedweight));
        setCurrentPage(1);
    };

    const handleColorChange = (color: any) => {
        const updatedcolor = selectedColor.includes(color)
            ? selectedColor.filter((clr) => clr !== color)
            : [...selectedColor, color];
        dispatch(setSelectedColor(updatedcolor));
        setCurrentPage(1);
    };

    const handleTagsChange = (tag: any) => {
        const updatedtag = selectedTags.includes(tag)
            ? selectedTags.filter((tg) => tg !== tag)
            : [...selectedTags, tag];
        dispatch(setSelectedTags(updatedtag));
        setCurrentPage(1);
    };

    const toggleView = (isGrid: any) => {
        setIsGridView(isGrid);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const openSidebar = () => {
        setIsSidebarOpen(true);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    if (error) return <div>Failed to load products</div>;

    return (
        <>
            <div className="bb-shop-pro-inner">
                <Row className="mb-minus-24">
                    <Col sm={12}>
                        <div className="bb-pro-list-top">
                            <Row>
                                <Col className='col-6'>
                                    <div className="bb-bl-btn">
                                        <button onClick={openSidebar} type="button" className={`grid-btn btn-filter ${isSidebarOpen ? "active" : ""}`}>
                                            <i className="ri-equalizer-2-line"></i>
                                        </button>
                                        <button onClick={() => toggleView(false)} type="button" className={`grid-btn btn-grid-100 ${!isGridView ? "active" : ""}`}>
                                            <i className="ri-apps-line"></i>
                                        </button>
                                        <button onClick={() => toggleView(true)} type="button" className={`grid-btn btn-grid-100 ${isGridView ? "active" : ""}`}>
                                            <i className="ri-list-unordered"></i>
                                        </button>
                                    </div>
                                </Col>
                                <Col className='col-6'>
                                    <div className="bb-select-inner">
                                        <select style={{ border: "none", background: "none", textWrap: "wrap" }} defaultValue="" className="custom-select custom-select-two" onChange={handleSortChange}>
                                            <option value="1">Sort by</option>
                                            <option value="2">Position</option>
                                            <option value="3">Relevance</option>
                                            <option value="4">Name, A to Z</option>
                                            <option value="5">Name, Z to A</option>
                                            <option value="6">Price, low to high</option>
                                            <option value="7">Price, high to low</option>
                                        </select>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    {!data ? (<><Spinner /></>) : (
                        <>
                            {/* Mobile: horizontal scroll with 2 columns visible */}
                            <div className="bb-scrollable-row d-flex d-md-none">
                                {data?.data.map((items: any, index: number) => (
                                    <ShopProductItemCard data={items} key={index} />
                                ))}
                            </div>

                            {/* Desktop/Tablet: keep existing grid */}
                            <Fade triggerOnce direction='up' duration={1000} delay={200} className={`d-none d-md-block col-lg-${col} ${colfive} ${width} ${lg} col-md-4 col-6 mb-24 bb-product-box pro-bb-content ${isGridView ? "width-100" : ""}`} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                                {data?.data.map((items: any, index: number) => (
                                    <ShopProductItemCard data={items} key={index} />
                                ))}
                            </Fade>
                        </>
                    )}
                    <Col sm={12}>
                        {!data?.data.length ? (<div style={{ textAlign: "center" }}>Products is not found.</div>) : (
                            <div className="bb-pro-pagination">
                                <p>Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, data?.totalItems)} of {data?.totalItems} item(s)</p>
                                <Paginantion currentPage={currentPage} totalPages={data?.totalPages} onPageChange={handlePageChange} />
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
            <ShopFullwidthSidebar
                handleTagsChange={handleTagsChange}
                selectedTags={selectedTags}
                handleColorChange={handleColorChange}
                selectedColor={selectedColor}
                handleWeightChange={handleWeightChange}
                selectedWeight={selectedWeight}
                handleCategoryChange={handleCategoryChange}
                selectedCategory={selectedCategory}
                closeSidebar={closeSidebar}
                isSidebarOpen={isSidebarOpen}
                handlePriceChange={handlePriceChange}
                min={minPrice}
                max={maxPrice}
            />
        </>
    )
}

export default ShopFullwidthProducts
