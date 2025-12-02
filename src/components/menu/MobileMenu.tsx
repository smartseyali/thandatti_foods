import banner from '@/utility/header/benner'
import blog from '@/utility/header/blog'
import classic from '@/utility/header/classic'
import column from '@/utility/header/columns'
import list from '@/utility/header/list'
import pages from '@/utility/header/pages'
import Link from 'next/link'
import React, { useState } from 'react'
import Collapse from 'react-bootstrap/Collapse';

const MobileMenu = ({
    isMobileMenuOpen,
    closeMobileManu,
    toggleMainMenu,
    activeMainMenu,
}: any) => {
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

    const toggleSubMenu = (submenu: string) => {
        setActiveSubMenu((prevSubMenu) => (prevSubMenu === submenu ? null : submenu));
    };

    return (
        <>
            <div style={{ display: isMobileMenuOpen ? "block" : "none" }} onClick={closeMobileManu} className="bb-mobile-menu-overlay"></div>
            <div id="bb-mobile-menu" className={`bb-mobile-menu ${isMobileMenuOpen ? "bb-menu-open" : ""}`}>
                <div className="bb-menu-title">
                    <span className="menu_title">My Menu</span>
                    <button onClick={closeMobileManu} type="button" className="bb-close-menu">×</button>
                </div>
                <div className="bb-menu-inner">
                    <div className="bb-menu-content">
                        <ul>
                            <li>
                                <Link href="/" className="d-flex align-items-center gap-2">
                                    <i className="ri-home-line fs-5"></i>
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop-full-width-col-4" className="d-flex align-items-center gap-2">
                                    <span>All categories</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop-full-width-col-4" className="d-flex align-items-center gap-2 position-relative">
                                    <i className="ri-fire-line fs-5"></i>
                                    <span>Best selling</span>
                                    <span className="badge bg-danger ms-2" style={{ fontSize: '9px', padding: '3px 6px', borderRadius: '4px' }}>HOT</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop-full-width-col-4" className="d-flex align-items-center gap-2 position-relative">
                                    <i className="ri-heart-line fs-5"></i>
                                    <span>Pattikadai Special</span>
                                    <span className="badge bg-success ms-2" style={{ fontSize: '9px', padding: '3px 6px', borderRadius: '4px' }}>BEST</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop-full-width-col-4" className="d-flex align-items-center gap-2 position-relative">
                                    <span>Special Combo</span>
                                    <span className="badge bg-danger ms-2" style={{ fontSize: '9px', padding: '3px 6px', borderRadius: '4px' }}>Offers</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/track-order" className="d-flex align-items-center gap-2">
                                    <span>Track Order</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="header-res-lan-curr">
                        {/* <!-- Social Start --> */}
                        <div className="header-res-social">
                            <div className="header-top-social">
                                <ul className="mb-0">
                                    <li className="list-inline-item">
                                        <Link href="#"><i className="ri-facebook-fill"></i></Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link href="#"><i className="ri-twitter-fill"></i></Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link href="#"><i className="ri-instagram-line"></i></Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link href="#"><i className="ri-linkedin-fill"></i></Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* <!-- Social End --> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileMenu
