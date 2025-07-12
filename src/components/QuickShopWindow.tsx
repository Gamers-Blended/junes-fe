import React, { useState, useEffect } from 'react';

interface QuickWindowProps {
    item: {
        id: string;
        name: string;
        slug: string;
        price: string;
        productImageUrl: string;
        releaseDate: string;
        language: string;
        subtitles: string;
        genre: string;
        players?: string;
    },
    onClose: () => void;
    onAddToCart: (item: any) => void;
}

const QuickShopWindow: React.FC<QuickWindowProps> = ({ item, onClose, onAddToCart }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedPlatform, setSelectedPlatform] = useState<string>('');
    const [selectedRegion, setSelectedLanguage] = useState<string>('');


    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // 1 second delay

        return () => clearTimeout(timer);
    }, []);


    return (
        <div className="quick-shop-window-container">
            {/* Loading Placeholder */}
            {isLoading && (
                <div className='product-slider-loading-placeholder'>
                    <div className='product-slider-loading-spinner'></div>
                    <div className='product-slider-loading-text'>Loading...</div>
                </div>
            )}
            {!isLoading && (
                <div className="quick-shop-content">
                    <button className='quick-shop-close-button' onClick={onClose}>X</button>
                    <h2>{item.name}</h2>
                    <img src={item.productImageUrl} alt={item.name} />
                    <p>Price: {item.price}</p>
                    <button onClick={() => onAddToCart(item)}>Add to Cart</button>
                    <button onClick={onClose}>Close</button>
                </div>
            )}
                
            
        </div>
    );
}

export default QuickShopWindow;