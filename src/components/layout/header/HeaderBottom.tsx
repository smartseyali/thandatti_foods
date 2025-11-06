import CategoryPopup from '@/components/category-popup/CategoryPopup';
import banner from '@/utility/header/benner';
import blog from '@/utility/header/blog';
import classic from '@/utility/header/classic';
import column from '@/utility/header/columns';
import list from '@/utility/header/list';
import pages from '@/utility/header/pages';
import productpage from '@/utility/header/productpage';
import Link from 'next/link';
import React, { useState } from 'react'
import { Row } from 'react-bootstrap';
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem } from 'rc-menu';
import 'rc-dropdown/assets/index.css';

const HeaderBottom = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>('Surat');
    const svgProps: React.SVGProps<SVGSVGElement> = {
        enableBackground: "new 0 0 512 512",
        xmlns: "http://www.w3.org/2000/svg",
    };

    const handleMenuClick = (info: any) => {
        setSelectedItem(`${info.key}`);
        setVisible(false);
    };

    const handleVisibleChange = (flag: boolean) => {
        setVisible(flag);
    };

    const openCategoryPopup = () => {
        setIsPopupOpen(true);
    };

    const closeCategoryPopup = () => {
        setIsPopupOpen(false);
    };

    const menu = (
        <Menu className='select-options bb-dropdown-location' style={{ display: "block", right: "-91px", top: "5px", borderRadius: "10px" }} onClick={handleMenuClick}>
            <MenuItem key="Surat">Surat</MenuItem>
            <MenuItem key="Delhi">Delhi</MenuItem>
            <MenuItem key="Rajkot">Rajkot</MenuItem>
            <MenuItem key="Udaipur">Udaipur</MenuItem>
        </Menu>
    );

    return (
        <>
            <div className="bb-main-menu-desk">
                <div className="container">
                    <Row>
                        <div className='col-12'>
                            <div className="bb-inner-menu-desk">
                                <Link onClick={openCategoryPopup} href="" className="bb-header-btn bb-sidebar-toggle bb-category-toggle">
                                    <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M384 928H192a96 96 0 0 1-96-96V640a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96zM192 608a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V640a32 32 0 0 0-32-32H192zM784 928H640a96 96 0 0 1-96-96V640a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v144a32 32 0 0 1-64 0V640a32 32 0 0 0-32-32H640a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h144a32 32 0 0 1 0 64zM384 480H192a96 96 0 0 1-96-96V192a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96zM192 160a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V192a32 32 0 0 0-32-32H192zM832 480H640a96 96 0 0 1-96-96V192a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96zM640 160a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V192a32 32 0 0 0-32-32H640z" />
                                    </svg>
                                </Link>
                                <button className="navbar-toggler shadow-none" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                    <i className="ri-menu-2-line"></i>
                                </button>
                               
                               
                            </div>
                        </div>
                    </Row>
                </div>
            </div>
            <CategoryPopup isPopupOpen={isPopupOpen} closeCategoryPopup={closeCategoryPopup} />
        </>
    )
}

export default HeaderBottom
