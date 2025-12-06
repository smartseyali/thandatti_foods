"use client"
import React, { useState } from 'react'
import StarRating from '../stars/StarRating'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { showErrorToast, showSuccessToast } from '../toast-popup/Toastify';
import { addCompare } from '@/store/reducer/compareSlice';
import { addWishlist } from '@/store/reducer/wishlistSlice';
import ItemModal from '../modal/ItemModal';
import Link from 'next/link';
import { addItemToCart, incrementCartItem } from '@/utils/cartOperations';
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

const ProductItemCard = ({ data }: any) => {
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
            const isItemInCart = cartSlice?.some((item: any) => item.productId === data.id || item.id === data.id);

            if (!isItemInCart) {
                await addItemToCart(dispatch, data, 1);
                showSuccessToast("Item added to cart");
            } else {
                await incrementCartItem(dispatch, data, cartSlice || []);
                showSuccessToast("Item quantity increased in cart");
            }
        } catch (error: any) {
            console.error('Error adding to cart:', error);
            showErrorToast(error.message || "Failed to add item to cart. Please login.");
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

    const handleBuyNow = async (data: Item) => {
        try {
            await incrementCartItem(dispatch, data, cartSlice || []);
            router.push('/checkout');
        } catch (error: any) {
            console.error('Error adding to cart for buy now:', error);
            showErrorToast(error.message || "Failed to process buy now.");
        }
    };

    return (
        <>
            <div className="bb-pro-box">
                <div className="bb-pro-img " onClick={handleProductClick} style={{ cursor: 'pointer' }}>
                    <span className="flags">
                        <span>{data.sale}</span>
                    </span>
                    <div className="inner-img">
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
                            <a onClick={(e) => { e.stopPropagation(); handleWishlist(data); }} title="Wishlist">
                                <i className={`ri-heart-${wishlistItem.some((item: any) => item.id === data.id) ? 'fill' : 'line'}`}></i>
                            </a>
                        </li>
                        <li className="bb-btn-group">
                            <a onClick={(e) => { e.stopPropagation(); handleCart(data); }} title="Add To Cart">
                                <i className="ri-shopping-bag-4-line"></i>
                            </a>
                        </li>
                        <li className="bb-btn-group">
                            <a onClick={(e) => { e.stopPropagation(); handleBuyNow(data); }} title="Buy Now">
                                <i className="ri-shopping-cart-2-line"></i>
                            </a>
                        </li>

                    </ul>
                </div>
                <div className="bb-pro-contact">
                    <div className="product-meta-row">
                        <span className="meta-badge meta-category">{data.category}</span>
                        <span className="meta-badge meta-weight">{data.weight}</span>
                        <div className="meta-badge meta-rating">
                            <i className="ri-star-fill"></i> {data.rating || 4.83}
                            <span className="meta-separator">|</span>
                            <i className="ri-verified-badge-fill verified-icon"></i>
                            <span className="review-count">({data.reviews || 851})</span>
                        </div>
                    </div>
                    <h4 className="bb-pro-title"><a onClick={handleProductClick} style={{ cursor: 'pointer' }}>{data.title}</a></h4>
                    <div className="bb-price">
                        <div className="inner-price">
                            <span className="new-price">₹{data.newPrice}</span>
                            <span className={data.oldPrice && data.oldPrice > 0 ? "old-price" : "item-left"}>
                                {data.oldPrice && data.oldPrice > 0 ? (typeof data.oldPrice === 'number' ? `₹${data.oldPrice.toFixed(2)}` : data.oldPrice) : ""}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <ItemModal data={data} isModalOpen={isModalOpen} closeItemModal={closeItemModal} />
        </>
    )
}

export default ProductItemCard
