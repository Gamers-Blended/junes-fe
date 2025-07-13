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
    const [selectedRegion, setSelectedRegion] = useState<string>('');
    const [selectedEdition, setSelectedEdition] = useState<string>('');


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
                                
                                    {/* Quantity and price */}
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
                                        <div className='product-price'>S${item.price}</div>
                                    </div>
                                </div>
                                    
                                {/* Platform */}
                                <div className='option-group option-buttons'>
                                    <label className='option-label'>Platform</label>
                                    <button
                                        className={`option-btn ${selectedPlatform === 'nintendo_switch' ? 'active' : ''}`}
                                        onClick={() => setSelectedPlatform('nintendo_switch')}
                                    >
                                        Switch
                                    </button>
                                    <button 
                                        className={`option-btn ${selectedPlatform === 'playstation_4' ? 'active' : ''}`}
                                        onClick={() => setSelectedPlatform('playstation_4')}
                                    >
                                        PS4
                                    </button>
                                </div>

                                {/* Region */}
                                <div className='option-group option-buttons'>
                                    <label className='option-label'>Region</label>
                                    <button
                                        className={`option-btn ${selectedRegion === 'asia' ? 'active' : ''}`}
                                        onClick={() => setSelectedRegion('asia')}
                                    >
                                        Asia
                                    </button>
                                    <button 
                                        className={`option-btn ${selectedRegion === 'united_states' ? 'active' : ''}`}
                                        onClick={() => setSelectedRegion('united_states')}
                                    >
                                        United States
                                    </button>
                                    <button 
                                        className={`option-btn ${selectedRegion === 'europe' ? 'active' : ''}`}
                                        onClick={() => setSelectedRegion('europe')}
                                    >
                                        Europe
                                    </button>
                                </div>

                                {/* Edition */}
                                <div className='option-group option-buttons'>
                                    <label className='option-label'>Edition</label>
                                    <button
                                        className={`option-btn ${selectedEdition === 'standard' ? 'active' : ''}`}
                                        onClick={() => setSelectedEdition('standard')}
                                    >
                                        Standard
                                    </button>
                                    <button 
                                        className={`option-btn ${selectedEdition === 'collectors' ? 'active' : ''}`}
                                        onClick={() => setSelectedEdition('collectors')}
                                    >
                                        Collector's
                                    </button>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className='product-details-table'>
                                <div className='detail-row'>
                                    <span className='detail-label'>Official Release Date</span>
                                    <span className='detail-value'>{item.releaseDate || 'Not Available'}</span>
                                </div>
                                <div className='detail-row'>
                                    <span className='detail-label'>Language</span>
                                    <span className='detail-value'>{item.language || 'Not Available'}</span>
                                </div>
                                <div className='detail-row'>
                                    <span className='detail-label'>Subtitles</span>
                                    <span className='detail-value'>{item.subtitles || 'Not Available'}</span>
                                </div>
                                <div className='detail-row'>
                                    <span className='detail-label'>Genre</span>
                                    <span className='detail-value'>{item.genre || 'Not Available'}</span>
                                </div>
                                <div className='detail-row'>
                                    <span className='detail-label'>Players</span>
                                    <span className='detail-value'>{item.players || 'Not Available'}</span>
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