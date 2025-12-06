"use client"
import React, { useState } from 'react'
import StarRating from '../stars/StarRating'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addItemToCart, incrementCartItem } from '@/utils/cartOperations';
import { showErrorToast, showSuccessToast } from '../toast-popup/Toastify';
import { addWishlist } from '@/store/reducer/wishlistSlice';
import { addCompare } from '@/store/reducer/compareSlice';
import ItemModal from '../modal/ItemModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Item {
    id: number;
    title: string;
    newPrice: number;
    weight: string;
    image: string;
    imageTwo: string;
    date: string;
    status: string;
    rating: number;
    oldPrice: number;
    location: string;
    brand: string;
    sku: number;
    category: string;
    quantity: number;
}

const ShopProductItemCard = ({ data }: any) => {
    const router = useRouter();

    const dispatch = useDispatch()
    const cartSlice = useSelector((state: RootState) => state.cart?.items);
    const wishlistItem = useSelector((state: RootState) => state.wishlist?.wishlist);
    const compareItems = useSelector((state: RootState) => state.compare?.compare)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProductClick = () => {
        router.push(`/product/${data.id}`);
    }

    const openItemModal = () => {
        setIsModalOpen(true)
    }

    const closeItemModal = () => {
        setIsModalOpen(false)
    }

    const handleCart = async (data: Item) => {
        try {
            await incrementCartItem(dispatch, data, cartSlice || []);
            showSuccessToast("Item added/updated in cart");
        } catch (error: any) {
            console.error('Error adding to cart:', error);
            showErrorToast(error.message || "Failed to add item to cart.");
        }
    };

    const handleBuyNow = async (data: Item) => {
        try {
            await incrementCartItem(dispatch, data, cartSlice || []);
            router.push('/checkout');
        } catch (error: any) {
            console.error('Error adding to cart for buy now:', error);
            showErrorToast(error.message || "Failed to process buy now.");
        }
    };

    const handleWishlist = (data: Item) => {
        const isItemInWishlist = wishlistItem.some(
            (item: Item) => item.id === data.id
        );
        if (!isItemInWishlist) {
            dispatch(addWishlist(data));
            showSuccessToast("Item added to wishlist");
        } else {
            showErrorToast("Item already have to wishlist");
        }
    };

    const handleCompareItem = (data: Item) => {
        const isItemInCompare = compareItems.some(
            (item: Item) => item.id === data.id
        );

        if (!isItemInCompare) {
            dispatch(addCompare(data));
            showSuccessToast("Item added to compare list");
        } else {
            showErrorToast("Item already have to compare list");
        }
    };

    return (
        <>
            <div className="bb-pro-box">
                <div className="bb-pro-img">
                    <span className="flags">
                        <span>{data.sale}</span>
                    </span>
                    <div className="inner-img" onClick={handleProductClick} style={{ cursor: 'pointer' }}>
                        <img 
                            className="main-img" 
                            src={data.image || '/assets/img/product/default.jpg'}
                            alt={data.title || 'product'}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.pattikadai.com'}/assets/img/product/default.jpg`;
                            }}
                        />
                        <img 
                            className="hover-img" 
                            src={data.imageTwo || data.image || '/assets/img/product/default.jpg'}
                            alt={data.title || 'product'}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.pattikadai.com'}/assets/img/product/default.jpg`;
                            }}
                        />
                    </div>
                    <ul className="bb-pro-actions">
                        <li className="bb-btn-group">
                            <a onClick={() => handleWishlist(data)} title="Wishlist">
                                <i className="ri-heart-line"></i>
                            </a>
                        </li>

                        <li className="bb-btn-group">
                            <a onClick={() => handleCart(data)} title="Add To Cart">
                                <i className="ri-shopping-bag-4-line"></i>
                            </a>
                        </li>
                        <li className="bb-btn-group">
                            <a onClick={() => handleBuyNow(data)} title="Buy Now">
                                <i className="ri-shopping-cart-2-line"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="bb-pro-contact">
                    <div className="bb-pro-subtitle">
                        <Link href={`/category/${data.category}`}>{data.category}</Link>
                        <StarRating rating={data.rating} />
                    </div>
                    <h4 className="bb-pro-title"><a onClick={handleProductClick} style={{ cursor: 'pointer' }}>{data.title}</a></h4>
                    {data.description && <p>{data.description}</p>}
                    <div className="bb-price">
                        <div className="inner-price">
                            <span className="new-price">₹{data.newPrice}</span>
                            <span className={`${data.oldPrice && data.oldPrice > 0 ? "old-price" : "item-left"}`}>
                                {data.oldPrice && data.oldPrice > 0 ? (typeof data.oldPrice === 'number' ? `₹${data.oldPrice.toFixed(2)}` : (typeof data.oldPrice === 'string' && data.oldPrice.startsWith('₹') ? data.oldPrice : `₹${data.oldPrice}`)) : ""}
                            </span>
                        </div>
                        <span className="last-items">{data.weight}</span>
                    </div>
                </div>
            </div>
            <ItemModal data={data} isModalOpen={isModalOpen} closeItemModal={closeItemModal} />
        </>
    )
}

export default ShopProductItemCard
