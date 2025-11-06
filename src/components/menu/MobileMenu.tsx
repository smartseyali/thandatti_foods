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
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <span onClick={() => toggleMainMenu('Categories')} className='menu-toggle'></span>
                                <Link onClick={() => toggleMainMenu('Categories')} href="">Categories</Link>
                                <Collapse in={activeMainMenu === 'Categories'}>
                                    <ul style={{ display: activeMainMenu === 'Categories' ? 'block' : 'none' }} className="sub-menu height-transition-1s-ease">
                                        <li>
                                            <span onClick={() => toggleSubMenu('Classic')} className='menu-toggle'></span>
                                            <a onClick={() => toggleSubMenu('Classic')} href="#">Classic</a>
                                            <Collapse in={activeSubMenu === 'Classic'}>
                                                <ul style={{ display: activeSubMenu === 'Classic' ? 'block' : 'none' }} className="sub-menu height-transition-1s-ease">
                                                    {classic.map((data, index) => (
                                                        <li key={index}>
                                                            <Link href={data.href}>{data.name}</Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Collapse>
                                        </li>
                                        <li>
                                            <span onClick={() => toggleSubMenu('Banner')} className='menu-toggle'></span>
                                            <a onClick={() => toggleSubMenu('Banner')} href="#">Banner</a>
                                            <Collapse in={activeSubMenu === 'Banner'}>
                                                <ul style={{ display: activeSubMenu === 'Banner' ? 'block' : 'none' }} className="sub-menu height-transition-1s-ease">
                                                    {banner.map((data, index) => (
                                                        <li key={index}>
                                                            <Link href={data.href}>{data.name}</Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Collapse>
                                        </li>
                                        <li>
                                            <span onClick={() => toggleSubMenu('Columns')} className='menu-toggle'></span>
                                            <a onClick={() => toggleSubMenu('Columns')} href="#">Columns</a>
                                            <Collapse in={activeSubMenu === 'Columns'}>
                                                <ul style={{ display: activeSubMenu === 'Columns' ? 'block' : 'none' }} className="sub-menu height-transition-1s-ease">
                                                    {column.map((data, index) => (
                                                        <li key={index}>
                                                            <Link href={data.href}>{data.name}</Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Collapse>
                                        </li>
                                        <li>
                                            <span onClick={() => toggleSubMenu('List')} className='menu-toggle'></span>
                                            <a onClick={() => toggleSubMenu('List')} href="#">List</a>
                                            <Collapse in={activeSubMenu === 'List'}>
                                                <ul style={{ display: activeSubMenu === 'List' ? 'block' : 'none' }} className="sub-menu height-transition-1s-ease">
                                                    {list.map((data, index) => (
                                                        <li key={index}>
                                                            <Link href={data.href}>{data.name}</Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Collapse>
                                        </li>
                                    </ul>
                                </Collapse>
                            </li>
                            <li>
                                <span onClick={() => toggleMainMenu('Products')} className='menu-toggle'></span>
                                <Link onClick={() => toggleMainMenu('Products')} href="#">Products</Link>
                                <Collapse in={activeMainMenu === 'Products'}>
                                    <ul style={{ display: activeMainMenu === 'Products' ? 'block' : 'none' }} className="sub-menu height-transition-1s-ease">
                                        <li>
                                            <span onClick={() => toggleSubMenu('Product')} className='menu-toggle'></span>
                                            <a onClick={() => toggleSubMenu('Product')} href="#">Product page</a>
                                            <Collapse in={activeSubMenu === 'Product'}>
                                                <ul style={{ display: activeSubMenu === 'Product' ? 'block' : 'none' }} className="sub-menu height-transition-1s-ease">
                                                    <li><Link href="/product-left-sidebar">Product left sidebar</Link></li>
                                                    <li><Link href="/product-right-sidebar">Product right sidebar</Link></li>
                                                </ul>
                                            </Collapse>
                                        </li>
                                        <li>
                                            <span onClick={() => toggleSubMenu('ProductAccordion')} className='menu-toggle'></span>
                                            <a onClick={() => toggleSubMenu('ProductAccordion')} href="#">Product Accordion</a>
                                            <Collapse in={activeSubMenu === 'ProductAccordion'}>
                                                <ul style={{ display: activeSubMenu === 'ProductAccordion' ? 'block' : 'none' }} className="sub-menu height-transition-1s-ease">
                                                    <li><Link href="/product-accordion-left-sidebar">left sidebar</Link></li>
                                                    <li><Link href="/product-accordion-right-sidebar">right sidebar</Link></li>
                                                </ul>
                                            </Collapse>
                                        </li>
                                        <li><Link href="/product-full-width">Product full width</Link></li>
                                        <li><Link href="/product-accordion-full-width">accordion full width</Link></li>
                                    </ul>
                                </Collapse>
                            </li>
                            <li>
                                <span onClick={() => toggleMainMenu('Pages')} className='menu-toggle'></span>
                                <Link onClick={() => toggleMainMenu('Pages')} href="#">Pages</Link>
                                <Collapse in={activeMainMenu === 'Pages'}>
                                    <ul style={{ display: activeMainMenu === 'Pages' ? 'block' : 'none' }} className="sub-menu height-transition-1s-ease">
                                        {pages.map((data, index) => (
                                            <li key={index}>
                                                <Link href={data.href}>{data.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </Collapse>
                            </li>
                            <li>
                                <span onClick={() => toggleMainMenu('Blog')} className='menu-toggle'></span>
                                <Link onClick={() => toggleMainMenu('Blog')} href="#">Blog</Link>
                                <Collapse in={activeMainMenu === 'Blog'}>
                                    <ul style={{ display: activeMainMenu === 'Blog' ? 'block' : 'none' }} className="sub-menu height-transition-1s-ease">
                                        {blog.map((data, index) => (
                                            <li key={index}>
                                                <Link href={data.href}>{data.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </Collapse>
                            </li>
                            <li>
                                <Link href="/offer">Offers</Link>
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
