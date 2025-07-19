import React from 'react';
import { useNavigate } from "react-router-dom";
import { Platform } from "../utils/Enums";

import ps4Image from "../assets/selectorBox/ps4.png";
import ps5Image from "../assets/selectorBox/ps5.png";
import nswImage from "../assets/selectorBox/nsw.png";
import nsw2Image from "../assets/selectorBox/nsw2.png";
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
        { src: ps4Image, alt: 'PlayStation 4', route: Platform.PS4 },
        { src: ps5Image, alt: 'PlayStation 5', route: Platform.PS5 },
        { src: nswImage, alt: 'Nintendo Switch', route: Platform.NSW },
        { src: nsw2Image, alt: 'Nintendo Switch 2', route: Platform.NSW2 },
        { src: xboxImage, alt: 'Xbox', route: Platform.XBOX },
        { src: pcImage, alt: 'PC', route: Platform.PC }
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