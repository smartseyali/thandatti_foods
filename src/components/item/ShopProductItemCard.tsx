"use client"
import React, { useState } from 'react'
import StarRating from '../stars/StarRating'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addItem, updateItemQuantity } from '@/store/reducer/cartSlice';
import { showErrorToast, showSuccessToast } from '../toast-popup/Toastify';
import { addWishlist } from '@/store/reducer/wishlistSlice';
import { addCompare } from '@/store/reducer/compareSlice';
import ItemModal from '../modal/ItemModal';
import Link from 'next/link';

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

    const dispatch = useDispatch()
    const cartSlice = useSelector((state: RootState) => state.cart?.items);
    const wishlistItem = useSelector((state: RootState) => state.wishlist?.wishlist);
    const compareItems = useSelector((state: RootState) => state.compare?.compare)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openItemModal = () => {
        setIsModalOpen(true)
    }

    const closeItemModal = () => {
        setIsModalOpen(false)
    }

    const handleCart = (data: Item) => {
        const isItemInCart = cartSlice?.some((item: Item) => item.id === data.id);

        if (!isItemInCart) {
            dispatch(addItem({ ...data, quantity: 1 }));
            showSuccessToast("Item added to cart item");
        } else {
            const updatedCartItems = cartSlice.map((item: Item) =>
                item.id === data.id
                    ? { ...item, quantity: item.quantity + 1, price: item.newPrice + data.newPrice } // Increment quantity and update price
                    : item
            );
            dispatch(updateItemQuantity(updatedCartItems));
            showSuccessToast("Item quantity increased in cart");
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
                            <a onClick={() => handleWishlist(data)} title="Wishlist">
                                <i className="ri-heart-line"></i>
                            </a>
                        </li>
                        <li className="bb-btn-group">
                            <a onClick={openItemModal} data-link-action="quickview"
                                title="Quick View" data-bs-toggle="modal"
                                data-bs-target="#bry_quickview_modal">
                                <i className="ri-eye-line"></i>
                            </a>
                        </li>
                        <li className="bb-btn-group">
                            <a onClick={() => handleCart(data)} title="Add To Cart">
                                <i className="ri-shopping-bag-4-line"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="bb-pro-contact">
                    <div className="bb-pro-subtitle">
                        <Link href="/shop-full-width-col-4">{data.category}</Link>
                        <StarRating rating={data.rating} />
                    </div>
                    <h4 className="bb-pro-title"><Link href={`/product/${data.id}`}>{data.title}</Link></h4>
                    {data.description && <p>{data.description}</p>}
                    <div className="bb-price">
                        <div className="inner-price">
                            <span className="new-price">₹{data.newPrice}</span>
                            <span className={`${data.oldPrice && data.oldPrice > 0 ? "old-price" : "item-left"}`}>
                                {data.oldPrice && data.oldPrice > 0 ? (typeof data.oldPrice === 'number' ? `₹${data.oldPrice.toFixed(2)}` : (typeof data.oldPrice === 'string' && data.oldPrice.startsWith('₹') ? data.oldPrice : `₹${data.oldPrice}`)) : data.itemLeft}
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
