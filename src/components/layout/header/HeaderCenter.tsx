import SidebarCart from '@/components/cart/SidebarCart';
import MobileMenu from '@/components/menu/MobileMenu';
import { RootState } from '@/store';
import { login, logout, setUserData } from '@/store/reducer/loginSlice';
import Tools from '@/tools/Tools';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, setSelectedCategory } from "../../../store/reducer/filterReducer"
import { Row } from 'react-bootstrap';
import CategoryPopup from '@/components/category-popup/CategoryPopup';
import Link from 'next/link';
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem } from 'rc-menu';
import 'rc-dropdown/assets/index.css';
import useSWR from 'swr';
import fetcher from '@/components/fetcher/Fetcher';
import { authStorage } from '@/utils/authStorage';

const HeaderCenter = ({ wishlistItem, cartSlice }: any) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { searchTerm, selectedCategory } = useSelector((state: RootState) => state.filter)
    const [searchInput, setSearchInput] = useState(searchTerm || "");
    const dispatch = useDispatch()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeMainMenu, setActiveMainMenu] = useState<string | null>(null);
    const isAuthenticated = useSelector((state: RootState) => state.login.isAuthenticated);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>('All Categories');
    
    // Fetch categories from API
    const { data: categoriesData, error: categoriesError } = useSWR("/api/category", fetcher);
    const categories = categoriesData || [];



    // Load user data from sessionStorage on mount
    useEffect(() => {
        const userData = authStorage.getUserData();
        const token = authStorage.getToken();
        if (userData && token) {
            dispatch(setUserData({
                isAuthenticated: true,
                user: { ...userData, token },
            }));
        }
    }, [dispatch]);

    const handleMenuClick = (info: any) => {
        const categoryName = info.key;
        setSelectedItem(categoryName === 'all' ? 'All Categories' : categoryName);
        setVisible(false);
        
        // Update selected category in Redux
        if (categoryName === 'all') {
            dispatch(setSelectedCategory([]));
        } else {
            dispatch(setSelectedCategory([categoryName]));
        }
        
        // Clear search term to ensure we see all products in the selected category
        dispatch(setSearchTerm(""));
        setSearchInput("");

        // Navigate to shop page to show filtered results
        router.push("/shop-full-width-col-4");
    };

    const handleVisibleChange = (flag: boolean) => {
        setVisible(flag);
    };

    const handleSearch = (event: any) => {
        const value = event.target.value;
        setSearchInput(value);
        // Update search term in Redux as user types (optional - can be removed if you only want to search on submit)
        // dispatch(setSearchTerm(value));
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        dispatch(setSearchTerm(searchInput));
        router.push("/shop-full-width-col-4");
    };
    
    // Sync search input with Redux state when it changes externally
    useEffect(() => {
        setSearchInput(searchTerm || "");
    }, [searchTerm]);
    
    // Update selected item display when category changes
    useEffect(() => {
        if (selectedCategory && selectedCategory.length > 0) {
            setSelectedItem(selectedCategory[0]);
        } else {
            setSelectedItem('All Categories');
        }
    }, [selectedCategory]);

    const openCart = () => {
        setIsCartOpen(true);
    };

    const closeCart = () => {
        setIsCartOpen(false);
    };

    const openMobileManu = () => {
        setIsMobileMenuOpen((prev: any) => !prev);
    }

    const closeMobileManu = () => {
        setIsMobileMenuOpen(false)
    }

    const handleLogout = () => {
        authStorage.clear();
        dispatch(logout());
        router.push("/");
    };

    const toggleMainMenu = (menuKey: any) => {
        setActiveMainMenu((prevMenu) => (prevMenu === menuKey ? null : menuKey));
    };

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

    const openCategoryPopup = () => {
        setIsPopupOpen(true);
    };

    const closeCategoryPopup = () => {
        setIsPopupOpen(false);
    };

    const menu = (
        <Menu className='select-options' style={{display: "block", top: "-5px", borderRadius: "10px", maxHeight: "300px", overflowY: "auto"}} onClick={handleMenuClick}>
            <MenuItem key="all">All Categories</MenuItem>
            {categories.map((cat: any) => (
                <MenuItem key={cat.category || cat.name} style={{padding: "8px 16px"}}>
                    {cat.category || cat.name} {cat.count ? `(${cat.count})` : ''}
                </MenuItem>
            ))}
        </Menu>
    );

    return (
        <>
            <div className="bottom-header">
                <div className="container">
                    <Row>
                        <div className='col-12'>
                            <div className="inner-bottom-header">
                                <div className="cols bb-logo-detail">
                                    {/* <!-- Header Logo Start --> */}
                                    <div className="header-logo" style={{ height: '60px' }}>
                                        <Link href="/">
                                            <img 
                                                src="/assets/img/logo/Thandatti.png" 
                                                alt="Thandatti foods" 
                                                className="light"
                                                style={{ maxHeight: '100%', width: 'auto', objectFit: 'contain' }}
                                            />
                                            <img 
                                                src="/assets/img/logo/Thandatti.png" 
                                                alt="Thandatti foods" 
                                                className="dark"
                                                style={{ maxHeight: '100%', width: 'auto', objectFit: 'contain' }}
                                            />
                                        </Link>
                                    </div>
                                    {/* <!-- Header Logo End --> */}
                                    <Link href="#" onClick={openCategoryPopup} className="bb-sidebar-toggle bb-category-toggle">
                                        <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M384 928H192a96 96 0 0 1-96-96V640a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96zM192 608a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V640a32 32 0 0 0-32-32H192zM784 928H640a96 96 0 0 1-96-96V640a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v144a32 32 0 0 1-64 0V640a32 32 0 0 0-32-32H640a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h144a32 32 0 0 1 0 64zM384 480H192a96 96 0 0 1-96-96V192a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96zM192 160a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V192a32 32 0 0 0-32-32H192zM832 480H640a96 96 0 0 1-96-96V192a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96zM640 160a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V192a32 32 0 0 0-32-32H640z" />
                                        </svg>
                                    </Link>
                                </div>
                                <div className="cols">
                                    <div className="header-search">
                                        <form onSubmit={handleSubmit} className="bb-btn-group-form" action="#">

                                            <Dropdown
                                                trigger={['click']}
                                                overlay={menu}
                                                animation="slide-up"
                                                onVisibleChange={handleVisibleChange}
                                                visible={visible}

                                            >
                                                <div className="inner-select location-dark">
                                                    <div className="custom-select">{selectedItem}<i style={{fontSize: "30px"}} className="ri-arrow-drop-down-line"></i></div>
                                                </div>
                                            </Dropdown>
                                            <input 
                                                value={searchInput}
                                                onChange={handleSearch} 
                                                className="form-control bb-search-bar" 
                                                placeholder="Search products..."
                                                type="text" 
                                            />
                                            <button className="submit" type="submit"><i className="ri-search-line"></i></button>
                                        </form>
                                    </div>
                                </div>
                                <div className="cols bb-icons">
                                    <div className="bb-flex-justify">
                                        <div className="bb-header-buttons">
                                            <div className="bb-acc-drop">
                                                <Link onClick={(e) => e.preventDefault()} href="#"
                                                    className="bb-header-btn bb-header-user dropdown-toggle bb-user-toggle"
                                                    title="Account">
                                                    <div className="header-icon">
                                                        <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M512.476 648.247c-170.169 0-308.118-136.411-308.118-304.681 0-168.271 137.949-304.681 308.118-304.681 170.169 0 308.119 136.411 308.119 304.681C820.594 511.837 682.645 648.247 512.476 648.247L512.476 648.247zM512.476 100.186c-135.713 0-246.12 109.178-246.12 243.381 0 134.202 110.407 243.381 246.12 243.381 135.719 0 246.126-109.179 246.126-243.381C758.602 209.364 648.195 100.186 512.476 100.186L512.476 100.186zM935.867 985.115l-26.164 0c-9.648 0-17.779-6.941-19.384-16.35-2.646-15.426-6.277-30.52-11.142-44.95-24.769-87.686-81.337-164.13-159.104-214.266-63.232 35.203-134.235 53.64-207.597 53.64-73.555 0-144.73-18.537-208.084-53.922-78 50.131-134.75 126.68-159.564 214.549 0 0-4.893 18.172-11.795 46.4-2.136 8.723-10.035 14.9-19.112 14.9L88.133 985.116c-9.415 0-16.693-8.214-15.47-17.452C91.698 824.084 181.099 702.474 305.51 637.615c58.682 40.472 129.996 64.267 206.966 64.267 76.799 0 147.968-23.684 206.584-63.991 124.123 64.932 213.281 186.403 232.277 329.772C952.56 976.901 945.287 985.115 935.867 985.115L935.867 985.115z" />
                                                        </svg>
                                                    </div>
                                                    <div className="bb-btn-desc">
                                                        <span className="bb-btn-title">Account</span>
                                                        <span className="bb-btn-stitle">{isAuthenticated ? "Logout" : "Login"}</span>
                                                    </div>
                                                </Link>
                                                <ul className="bb-dropdown-menu">
                                                    {isAuthenticated ? (
                                                        <>
                                                            <li><Link className="dropdown-item" href="/orders">Orders</Link></li>
                                                            <li><Link className="dropdown-item" href="/user-profile">My Profile</Link></li>
                                                            <li><Link href="/#" className="dropdown-item" onClick={handleLogout}>Logout</Link></li>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <li><Link className="dropdown-item" href="/register">Register</Link></li>
                                                            <li><Link className="dropdown-item" href="/checkout">Checkout</Link></li>
                                                            <li><Link className="dropdown-item" href="/login">Login</Link></li>
                                                        </>
                                                    )}

                                                </ul>
                                            </div>
                                            <Link href="/wishlist" className="bb-header-btn bb-wish-toggle" title="Wishlist">
                                                <div className="header-icon">
                                                    <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M512 128l121.571556 250.823111 276.366222 39.111111-199.281778 200.504889L756.622222 896 512 769.536 267.377778 896l45.852444-277.617778-199.111111-200.504889 276.366222-39.111111L512 128m0-56.888889a65.962667 65.962667 0 0 0-59.477333 36.807111l-102.940445 213.703111-236.828444 35.214223a65.422222 65.422222 0 0 0-52.366222 42.979555 62.577778 62.577778 0 0 0 15.274666 64.967111l173.511111 173.340445-40.248889 240.355555a63.374222 63.374222 0 0 0 26.993778 62.577778 67.242667 67.242667 0 0 0 69.632 3.726222L512 837.290667l206.478222 107.605333a67.356444 67.356444 0 0 0 69.688889-3.726222 63.374222 63.374222 0 0 0 26.908445-62.577778l-40.277334-240.355556 173.511111-173.340444a62.577778 62.577778 0 0 0 15.246223-64.967111 65.422222 65.422222 0 0 0-52.366223-42.979556l-236.8-35.214222-102.968889-213.703111A65.848889 65.848889 0 0 0 512 71.111111z"
                                                            fill="#364C58" />
                                                    </svg>
                                                </div>
                                                <div className="bb-btn-desc">
                                                    <span className="bb-btn-title"><b className="bb-wishlist-count">{wishlistItem.length} </b>
                                                        items</span>
                                                    <span className="bb-btn-stitle">Wishlist</span>
                                                </div>
                                            </Link>
                                            <Link onClick={openCart} className="bb-header-btn bb-cart-toggle" href="#" title="Cart">
                                                <div className="header-icon">
                                                    <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M351.552 831.424c-35.328 0-63.968 28.64-63.968 63.968 0 35.328 28.64 63.968 63.968 63.968 35.328 0 63.968-28.64 63.968-63.968C415.52 860.064 386.88 831.424 351.552 831.424L351.552 831.424 351.552 831.424zM799.296 831.424c-35.328 0-63.968 28.64-63.968 63.968 0 35.328 28.64 63.968 63.968 63.968 35.328 0 63.968-28.64 63.968-63.968C863.264 860.064 834.624 831.424 799.296 831.424L799.296 831.424 799.296 831.424zM862.752 799.456 343.264 799.456c-46.08 0-86.592-36.448-92.224-83.008L196.8 334.592 165.92 156.128c-1.92-15.584-16.128-28.288-29.984-28.288L95.2 127.84c-17.664 0-32-14.336-32-31.968 0-17.664 14.336-32 32-32l40.736 0c46.656 0 87.616 36.448 93.28 83.008l30.784 177.792 54.464 383.488c1.792 14.848 15.232 27.36 28.768 27.36l519.488 0c17.696 0 32 14.304 32 31.968S880.416 799.456 862.752 799.456L862.752 799.456zM383.232 671.52c-16.608 0-30.624-12.8-31.872-29.632-1.312-17.632 11.936-32.928 29.504-34.208l433.856-31.968c15.936-0.096 29.344-12.608 31.104-26.816l50.368-288.224c1.28-10.752-1.696-22.528-8.128-29.792-4.128-4.672-9.312-7.04-15.36-7.04L319.04 223.84c-17.664 0-32-14.336-32-31.968 0-17.664 14.336-31.968 32-31.968l553.728 0c24.448 0 46.88 10.144 63.232 28.608 18.688 21.088 27.264 50.784 23.52 81.568l-50.4 288.256c-5.44 44.832-45.92 81.28-92 81.28L385.6 671.424C384.8 671.488 384 671.52 383.232 671.52L383.232 671.52zM383.232 671.52" />
                                                    </svg>
                                                    <span className="main-label-note-new"></span>
                                                </div>
                                                <div className="bb-btn-desc">
                                                    <span className="bb-btn-title"><b className="bb-cart-count">{cartSlice.length}</b> items</span>
                                                    <span className="bb-btn-stitle">Cart</span>
                                                </div>
                                            </Link>
                                            <Link onClick={openMobileManu} href="#" className="bb-toggle-menu">
                                                <div className="header-icon">
                                                    <i className="ri-menu-3-fill"></i>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>
                </div>
            </div>
            <SidebarCart isCartOpen={isCartOpen} closeCart={closeCart} />
            <MobileMenu activeMainMenu={activeMainMenu} toggleMainMenu={toggleMainMenu} isMobileMenuOpen={isMobileMenuOpen} closeMobileManu={closeMobileManu} />
            <Tools />
            <CategoryPopup isPopupOpen={isPopupOpen} closeCategoryPopup={closeCategoryPopup} />
        </>
    )
}

export default HeaderCenter;
