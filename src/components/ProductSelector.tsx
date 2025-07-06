import React from 'react';

import ps4Image from "../assets/selectorBox/ps4.png";
import ps5Image from "../assets/selectorBox/ps5.png";
import nsImage from "../assets/selectorBox/ns.png";
import ns2Image from "../assets/selectorBox/ns2.png";
import xboxImage from "../assets/selectorBox/xbox.png";
import pcImage from "../assets/selectorBox/pc.png";


const ProductSelector: React.FC = () => {
    const platforms = [
        { src: ps4Image, alt: 'PlayStation 4', badge: 'PlayStation 4' },
        { src: ps5Image, alt: 'PlayStation 5', badge: 'PlayStation 5' },
        { src: nsImage, alt: 'Nintendo Switch', badge: 'Nintendo Switch' },
        { src: ns2Image, alt: 'Nintendo Switch 2', badge: 'Nintendo Switch 2' },
        { src: xboxImage, alt: 'Xbox', badge: 'Xbox' },
        { src: pcImage, alt: 'PC', badge: 'PC' }
    ];

    return (
        <div className='product-selector-container'>
            <div className='product-slider-header'>
                <h2>Search by Platform</h2>
            </div>
            <div className='product-selector-gridbox'>
                {platforms.map((platform, index) => (
                    <div key={index} className='product-selector-platform-box'>
                        <div className='product-selector-platform-image-container'>
                            <img src={platform.src} alt={platform.alt} className='product-selector-image'/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductSelector;