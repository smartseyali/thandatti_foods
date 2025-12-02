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
        router.push("/shop-full-width-col-6");
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
        router.push("/shop-full-width-col-6");
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
                            <div className="inner-bottom-header d-flex align-items-center justify-content-between" style={{ minHeight: '80px' }}>
                                {/* Left: Logo */}
                                <div className="header-logo me-3" style={{ height: '60px' }}>
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

                                {/* Center: Navigation Menu */}
                                <div className="main-menu d-none d-xl-flex align-items-center gap-4">
                                    <Link href="/" className="menu-item d-flex align-items-center gap-2 text-dark text-decoration-none">
                                        <i className="ri-home-line fs-5"></i>
                                        <span className="fw-medium">Home</span>
                                    </Link>
                                    <Link href="/shop-full-width-col-4" className="menu-item text-dark text-decoration-none">
                                        <span className="fw-medium">All categories</span>
                                    </Link>
                                    <Link href="/shop-full-width-col-4" className="menu-item d-flex align-items-center gap-2 text-dark text-decoration-none position-relative">
                                        <i className="ri-fire-line fs-5"></i>
                                        <span className="fw-medium">Best selling</span>
                                        <span className="badge bg-danger position-absolute" style={{ top: '-12px', right: '-25px', fontSize: '9px', padding: '3px 6px', borderRadius: '4px' }}>HOT</span>
                                    </Link>
                                    <Link href="/shop-full-width-col-4" className="menu-item d-flex align-items-center gap-2 text-dark text-decoration-none position-relative">
                                        <i className="ri-heart-line fs-5"></i>
                                        <span className="fw-medium">Pattikadai Special</span>
                                        <span className="badge bg-success position-absolute" style={{ top: '-12px', right: '-25px', fontSize: '9px', padding: '3px 6px', borderRadius: '4px' }}>BEST</span>
                                    </Link>
                                    <Link href="/shop-full-width-col-4" className="menu-item text-dark text-decoration-none position-relative">
                                        <span className="fw-medium">Special Combo</span>
                                        <span className="badge bg-danger position-absolute" style={{ top: '-12px', right: '-30px', fontSize: '9px', padding: '3px 6px', borderRadius: '4px' }}>Offers</span>
                                    </Link>
                                    <Link href="/track-order" className="menu-item text-dark text-decoration-none">
                                        <span className="fw-medium">Track Order</span>
                                    </Link>
                                </div>

                                {/* Right: Icons */}
                                <div className="header-icons d-flex align-items-center gap-4">
                                    <div className="search-icon cursor-pointer">
                                        <i className="ri-search-line fs-4 text-dark"></i>
                                    </div>
                                    <Link href={isAuthenticated ? "/user-profile" : "/login"} className="user-icon text-dark">
                                        <i className="ri-user-line fs-4"></i>
                                    </Link>
                                    <Link href="/wishlist" className="wishlist-icon position-relative text-dark">
                                        <i className="ri-heart-line fs-4"></i>
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-black text-white" style={{ fontSize: '10px', padding: '3px 5px', border: '1px solid #fff' }}>
                                            {wishlistItem.length}
                                        </span>
                                    </Link>
                                    <Link onClick={openCart} href="#" className="cart-icon position-relative text-dark">
                                        <i className="ri-shopping-bag-line fs-4"></i>
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-black text-white" style={{ fontSize: '10px', padding: '3px 5px', border: '1px solid #fff' }}>
                                            {cartSlice.length}
                                        </span>
                                    </Link>
                                    <Link onClick={openMobileManu} href="#" className="bb-toggle-menu d-xl-none text-dark">
                                        <i className="ri-menu-3-fill fs-4"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Row>
                </div>
            </div>
            <SidebarCart isCartOpen={isCartOpen} closeCart={closeCart} />
            <MobileMenu activeMainMenu={activeMainMenu} toggleMainMenu={toggleMainMenu} isMobileMenuOpen={isMobileMenuOpen} closeMobileManu={closeMobileManu} />
            {/* <Tools /> */}
            <CategoryPopup isPopupOpen={isPopupOpen} closeCategoryPopup={closeCategoryPopup} />
        </>
    )
}

export default HeaderCenter;
