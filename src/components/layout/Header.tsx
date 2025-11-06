"use client"
import React from 'react'
import HeaderTop from './header/HeaderTop'
import HeaderCenter from './header/HeaderCenter'
import HeaderBottom from './header/HeaderBottom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import NewsletterModal from '../modal/NewsletterModal'

const Header = () => {
  const wishlistItem = useSelector((state: RootState) => state.wishlist?.wishlist);
  const cartSlice = useSelector((state: RootState) => state.cart?.items);

  return (
    <header className="bb-header">
      {/* <HeaderTop /> */}
      <HeaderCenter wishlistItem={wishlistItem} cartSlice={cartSlice} />
      <HeaderBottom />
    </header>
  )
}

export default Header
