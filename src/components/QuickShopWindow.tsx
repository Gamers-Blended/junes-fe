import React, { useState, useEffect } from 'react';

interface ProductDTO {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    platform: string;
    region: string;
    edition: string;
    publisher: string;
    releaseDate: string;
    series: string[];
    genres: string[];
    languages: string[];
    numberOfPlayers: string[];
    unitsSold: number;
    stock: number;
    productImageUrl: string;
    imageUrlList: string[];
    editionNotes: string;
    createdOn: string;
}

interface ProductVariantDTO {
    platform: string;
    region: string;
    edition: string;
    price: number;
}

interface ProductDetailsResponse {
    productDTO: ProductDTO;
    productVariantDTOList: ProductVariantDTO[];
}

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
    const [productData, setProductData] = useState<ProductDTO | null>(null);
    const [productVariants, setProductVariants] = useState<ProductVariantDTO[]>([]);
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [error, setError] = useState<string>('');

    // Get unique options from variants
    const availablePlatforms = [...new Set(productVariants.map(v => v.platform))];
    const availableRegions = [...new Set(productVariants.map(v => v.region))];
    const availableEditions = [...new Set(productVariants.map(v => v.edition))];

    // Get available regions for selected platform
    const availableRegionsForPlatform = selectedPlatform
        ? [...new Set(productVariants.filter(v => v.platform === selectedPlatform).map(v => v.region))]
        : availableRegions;

    // Get available editions for selected platform and region
    const availableEditionsForSelection = selectedPlatform && selectedRegion
        ? [...new Set(productVariants.filter(v => v.platform === selectedPlatform && v.region === selectedRegion).map(v => v.edition))]
        : availableEditions;

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    const fetchProductDetails = async () => {
        try {
            setIsLoading(true);
            setError('');

            const response = await fetch(`http://localhost:8080/junes/api/v1/product/details/${item.slug}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: ProductDetailsResponse = await response.json();

            const urlPrefix = "https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/";

            // Append prefix to each productImageUrl
            data.productDTO.productImageUrl = urlPrefix + data.productDTO.productImageUrl

            setProductData(data.productDTO);
            setProductVariants(data.productVariantDTOList);

            // Set default selections if variants exist
            if (data.productVariantDTOList.length > 0) {
                console.log('First varient ' + data.productVariantDTOList[0].platform);
                const firstVariant = data.productVariantDTOList[0];
                setSelectedPlatform(firstVariant.platform);
                setSelectedRegion(firstVariant.region);
                setSelectedEdition(firstVariant.edition);
                setCurrentPrice(firstVariant.price);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch product details');
            console.error('Error fetching product details:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const updatePrice = (platform: string, region: string, edition: string) => {
        const variant = productVariants.find(v => 
            v.platform === platform && v.region === region && v.edition == edition);
        if (variant) {
            setCurrentPrice(variant.price);
        }
    };

    const handlePlatformChange = (platform: string) => {
        setSelectedPlatform(platform);

        // Reset region and edition if not available for new platform
        const availableRegionsForNewPlatform = [...new Set(productVariants.filter(v => v.platform === platform).map(v => v.region))];

        // Reset to 1st new region if current region not available for new platform
        if (!availableRegionsForNewPlatform.includes(selectedRegion)) {
            const newRegion = availableRegionsForNewPlatform[0] || '';
            setSelectedRegion(newRegion);
            
            // Reset to 1st new edition
            const availableEditionsForNewSelection = [...new Set(productVariants.filter(v => v.platform === platform && v.region === newRegion).map(v => v.edition))];
            const newEdition = availableEditionsForNewSelection[0] || '';
            setSelectedEdition(newEdition);

            updatePrice(platform, newRegion, newEdition);
        } else {
            // Currently selected region also available for new platform
            const availableEditionsForNewSelection = [...new Set(productVariants.filter(v => v.platform === platform && v.region === selectedRegion).map(v => v.edition))];
            
            // Reset to 1st new edition if current edition not available for new platform and region
            if (!availableEditionsForNewSelection.includes(selectedEdition)) {
                const newEdition = availableEditionsForNewSelection[0] || '';
                setSelectedEdition(newEdition);

                updatePrice(platform, selectedRegion, newEdition);
            } else {
                // Currently selected edition also available for new platform and region
                updatePrice(platform, selectedRegion, selectedEdition);
            }
        }
    };

    const handleRegionChange = (region: string) => {
        setSelectedRegion(region);

        const availableEditionsForNewSelection = [...new Set(productVariants.filter(v => v.platform === selectedPlatform && v.region === region).map(v => v.edition))];
        // Reset to 1st new edition if current edition not available for new region
        if (!availableEditionsForNewSelection.includes(selectedEdition)) {
            const newEdition = availableEditionsForNewSelection[0] || '';
            setSelectedEdition(newEdition);
            updatePrice(selectedPlatform, region, newEdition);
        } else {
            updatePrice(selectedPlatform, region, selectedEdition);
        }
    };

    const handleEditionChange = (edition: string) => {
        setSelectedEdition(edition);
        updatePrice(selectedPlatform, selectedRegion, edition);
    };

    const formatPlatformName = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'playstation_4':
                return 'PS4';
            case 'playstation_5':
                return 'PS5';
            case 'nintendo_switch':
                return 'Switch'
            case 'nintendo_switch2':
                return 'Switch 2'
            case 'xbox':
                return 'Xbox'
            case 'pc':
                return 'PC'
            default:
                return platform.charAt(0).toUpperCase() + platform.slice(1);
        }
    };

    const formatRegionName = (region: string) => {
        switch (region.toLowerCase()) {
            case 'asia':
                return 'Asia';
            case 'united_states':
            case 'us':
                return 'United States';
            case 'europe':
                return 'Europe';
            default:
                return region.charAt(0).toUpperCase() + region.slice(1);
        }
    };

    const formatEditionName = (edition: string) => {
        switch (edition.toLowerCase()) {
            case 'standard':
                return 'Standard';
            case 'collectors':
                return 'Collector\'s';
            default:
                return edition.charAt(0).toUpperCase() + edition.slice(1);
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, [item.slug]);

    // Log productData when it changes
    useEffect(() => {
        if (productData) {
            console.log('productData state updated:', productData);
        }
    }, [productData]);


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
            {!isLoading && !error && productData && productVariants.length > 0 && (
                console.log('Rendering quick shop content', { productData, productVariants }),
                (
                <div className="quick-shop-content">
                    <button className='quick-shop-close-button' onClick={onClose}>X</button>
                    
                    <div className='product-container'>
                        <div className="product-image-section">
                            <img className='product-image' src={productData.productImageUrl} alt={productData.name} />
                        </div>

                        <div className='product-info-section'>
                            <h1 className='product-title'>{productData.name}</h1>

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
                                        <div className='product-price'>S${currentPrice.toFixed(2)}</div>
                                    </div>
                                </div>
                                    
                                {/* Platform */}
                                {availablePlatforms.length > 0 && (
                                    <div className='option-group option-buttons'>
                                        <label className='option-label'>Platform</label>
                                        {availablePlatforms.map(platform => (
                                            <button
                                                className={`option-btn ${selectedPlatform === platform ? 'active' : ''}`}
                                                onClick={() => setSelectedPlatform(platform)}
                                            >
                                                {formatPlatformName(platform)}
                                            </button>
                                        ))}
                                    </div>
                                )}                              

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

                            {/* Add To Cart */}
                            <button className='add-to-cart-btn' onClick={() => onAddToCart(item)}>
                                Add to Cart
                            </button>

                        </div>
                    </div>
                </div>
                )
            )}
                
            
        </div>
    );
}

export default QuickShopWindow;