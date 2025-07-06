import React from 'react';
import { useNavigate } from "react-router-dom";

import ps4Image from "../assets/selectorBox/ps4.png";
import ps5Image from "../assets/selectorBox/ps5.png";
import nsImage from "../assets/selectorBox/ns.png";
import ns2Image from "../assets/selectorBox/ns2.png";
import xboxImage from "../assets/selectorBox/xbox.png";
import pcImage from "../assets/selectorBox/pc.png";

interface PlatformCard {
    src: string;
    alt: string;
    route: string;
}

const ProductSelector: React.FC = () => {
    const navigate = useNavigate();
    const platforms: PlatformCard[] = [
        { src: ps4Image, alt: 'PlayStation 4', route: 'ps4' },
        { src: ps5Image, alt: 'PlayStation 5', route: 'ps5' },
        { src: nsImage, alt: 'Nintendo Switch', route: 'ns' },
        { src: ns2Image, alt: 'Nintendo Switch 2', route: 'ns2' },
        { src: xboxImage, alt: 'Xbox', route: 'xbox' },
        { src: pcImage, alt: 'PC', route: 'pc' }
    ];

    const handleImageClick = (link: string) => {
        navigate('products/listings/' + link);
    };

    return (
        <div className='product-selector-container'>
            <div className='product-slider-header'>
                <h2>Search by Platform</h2>
            </div>
            <div className='product-selector-gridbox'>
                {platforms.map((platform, index) => (
                    <div key={index} className='product-selector-platform-box'>
                        <div 
                            className='product-selector-platform-image-container'
                            onClick={() => handleImageClick(platform.route)}
                        >
                            <img src={platform.src} alt={platform.alt}/>
                        </div>
                    </div>        
                ))}
            </div>
        </div>
    )
}

export default ProductSelector;