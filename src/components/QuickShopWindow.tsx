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


    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    }

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

            {/* Actual Window */}
            {!isLoading && (
                <div className="quick-shop-content">
                    <button className='quick-shop-close-button' onClick={onClose}>X</button>
                    
                    <div className='product-container'>
                        <div className="product-image-section">
                            <img className='product-image' src={item.productImageUrl} alt={item.name} />
                        </div>

                        <div className='product-info-section'>
                            <h1 className='product-title'>{item.name}</h1>

                            <div className='product-options'>
                                <div className='option-group'>
                                
                                    <div className='option-row'>

                                        <div className='quantity-container'>
                                            <label className='option-label'>Quantity</label>
                                            <div className='quantity-selector'>
                                                <button
                                                    className='quantity-btn'
                                                    onClick={() => handleQuantityChange(-1)}
                                                    disabled={quantity <= 1}
                                                    >
                                                        -
                                                </button>
                                                <input 
                                                    className='quantity-input'
                                                    type='number'
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                />
                                                <button
                                                    className='quantity-btn'
                                                    onClick={() => handleQuantityChange(1)}
                                                    >
                                                        +
                                                </button>
                                            </div>
                                        </div>

                                        <div className='product-price'>{item.price}</div>
                                    
                                    </div>
                                </div>
                                    
                                <div className='option-group'>
                                    <label className='option-label'>Platform</label>
                                    <div className='option-buttons'>
                                        <button
                                            className={`option-btn ${selectedPlatform === 'Switch' ? 'active' : ''}`}
                                            onClick={() => setSelectedPlatform('switch')}
                                        >
                                            Switch
                                        </button>
                                        <button 
                                            className={`option-btn ${selectedPlatform === 'PS4' ? 'active' : ''}`}
                                            onClick={() => setSelectedPlatform('PS4')}
                                        >
                                            PS4
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    
                    <button onClick={() => onAddToCart(item)}>Add to Cart</button>
                </div>
            )}
                
            
        </div>
    );
}

export default QuickShopWindow;