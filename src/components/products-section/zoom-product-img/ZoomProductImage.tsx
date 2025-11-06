import React from 'react'
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';

const ZoomProductImage = ({ src }: any) => {
  return (
    <div>
      <InnerImageZoom
        src={src}
        zoomSrc={src}
        zoomType="hover"
        zoomPreload={true}
      />
    </div>
  )
}

export default ZoomProductImage
