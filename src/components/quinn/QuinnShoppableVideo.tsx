"use client";
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Modal } from 'react-bootstrap';
import "swiper/css";
import "swiper/css/navigation";

const QuinnShoppableVideo = () => {
    const [showModal, setShowModal] = useState(false);
    const [currentVideo, setCurrentVideo] = useState("");

    const videos = [
        "https://ueirorganic.com/cdn/shop/files/quinn_oz8ke8ahqsodmsjl75fjhzec.mp4",
        "https://ueirorganic.com/cdn/shop/files/quinn_cd4udp3da3yvb7sp98vbri3z.mp4",
        "https://ueirorganic.com/cdn/shop/files/quinn_ueons1igmpo1wdb98p2i5v8m.mp4"
    ];

    const handleVideoClick = (videoSrc: string) => {
        setCurrentVideo(videoSrc);
        setShowModal(true);
    };

    return (
        <section className="section-quinn padding-tb-50">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title text-center mb-30">
                            <h3 className="bb-title">Shop By Videos</h3>
                        </div>
                        <div className="quinn-video-slider">
                            <Swiper
                                modules={[Autoplay, Navigation]}
                                spaceBetween={20}
                                slidesPerView={4}
                                navigation={true}
                                centerInsufficientSlides={true}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1,
                                    },
                                    576: {
                                        slidesPerView: 2,
                                    },
                                    992: {
                                        slidesPerView: 3,
                                    },
                                    1200: {
                                        slidesPerView: 4,
                                    }
                                }}
                                className="quinn-swiper"
                            >
                                {videos.map((videoSrc, index) => (
                                    <SwiperSlide key={index}>
                                        <div 
                                            className="video-card"
                                            onClick={() => handleVideoClick(videoSrc)}
                                            style={{
                                                borderRadius: '15px',
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                                aspectRatio: '9/16',
                                                position: 'relative',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <video
                                                src={videoSrc}
                                                autoPlay
                                                loop
                                                playsInline
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>

            <Modal 
                show={showModal} 
                onHide={() => setShowModal(false)} 
                centered 
                size="lg"
                contentClassName="bg-transparent border-0"
            >
                <Modal.Body className="p-0 position-relative" style={{ backgroundColor: 'transparent' }}>
                    <button 
                        type="button" 
                        className="btn-close btn-close-white position-absolute top-0 end-0 m-3" 
                        aria-label="Close" 
                        onClick={() => setShowModal(false)} 
                        style={{ zIndex: 10, filter: 'invert(1)' }}
                    ></button>
                    <div style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: 'transparent' }}>
                        <video 
                            src={currentVideo} 
                            muted={false}
                            autoPlay 
                            style={{ width: '100%', maxHeight: '80vh', display: 'block' }} 
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </section>
    );
};

export default QuinnShoppableVideo;
