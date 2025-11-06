import Link from 'next/link'
import React from 'react'
import { Row } from 'react-bootstrap'

const HeaderTop = () => {
    return (
        <div className="top-header">
            <div className="container">
                <Row>
                    <div className='col-12'>
                        <div className="inner-top-header">
                            <div className="col-left-bar">
                                <Link href="/shop-full-width-col-4">Flat 50% Off On Grocery Shop.</Link>
                            </div>
                            <div className="col-right-bar">
                                <div className="cols">
                                    <Link href="/faq">Help?</Link>
                                </div>
                                <div className="cols">
                                    <Link href="/track-order">Track Order</Link>
                                </div>
                                <div className="cols">
                                    <div className="custom-dropdown">
                                        <Link className="bb-dropdown-toggle" href="#">Language</Link>
                                        <ul className="dropdown">
                                            <li><Link href='#'>English</Link></li>
                                            <li><Link href='#'>Hindi</Link></li>
                                            <li><Link href='#'>Gujarati</Link></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="cols">
                                    <div className="custom-dropdown">
                                        <Link className="bb-dropdown-toggle" href="#">Currency</Link>
                                        <ul className="dropdown">
                                            <li><Link href='#'>USD $</Link></li>
                                            <li><Link href='#'>EUR €</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
            </div>
        </div>
    )
}

export default HeaderTop
