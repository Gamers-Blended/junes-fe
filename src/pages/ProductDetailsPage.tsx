import React, { useState, useEffect, CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { formatPlatformName, formatRegionName, formatEditionName, formatStringGeneral, getStockStatus } from '../utils/utils.ts';
import { ProductDTO, ProductVariantDTO, ProductDetailsResponse } from '../types/products.ts';
import { StockStatus } from '../utils/Enums.tsx';
import { useAppSelector } from '../store/hooks';


const ProductDetailsPage: React.FC = () => {
    const { slug } = useParams();
    const selectedItem = useAppSelector((state) => state.product.selectedItem);

    const [productDetails, setProductDetails] = useState<ProductDetailsResponse | null>(null);
    const [currentStock, setCurrentStock] = useState<number>(0);
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [currentProductImageUrl, setCurrentProductImageUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedPlatform, setSelectedPlatform] = useState<string>('');
    const [selectedRegion, setSelectedRegion] = useState<string>('');
    const [selectedEdition, setSelectedEdition] = useState<string>('');

    // Get unique options from variants
    const availablePlatforms = [...new Set(productDetails?.productVariantDTOList.map(v => v.platform))];
    const availableRegions = [...new Set(productDetails?.productVariantDTOList.map(v => v.region))];
    const availableEditions = [...new Set(productDetails?.productVariantDTOList.map(v => v.edition))];

    // Get available regions for selected platform
    const availableRegionsForPlatform = selectedPlatform
        ? [...new Set(productDetails?.productVariantDTOList.filter(v => v.platform === selectedPlatform).map(v => v.region))]
        : availableRegions;

    // Get available editions for selected platform and region
    const availableEditionsForSelection = selectedPlatform && selectedRegion
        ? [...new Set(productDetails?.productVariantDTOList.filter(v => v.platform === selectedPlatform && v.region === selectedRegion).map(v => v.edition))]
        : availableEditions;

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!slug) return;
            
            try {
                setLoading(true);
                const response = await axios.get<ProductDetailsResponse>(
                    `http://localhost:8080/junes/api/v1/product/details/${slug}`
                );
                setProductDetails(response.data);

                // Set default selections if variants exist
                if (response.data.productVariantDTOList.length > 0 && selectedItem) {
                    // Try to find a variant matching the platform from props
                    const matchingVariant = response.data.productVariantDTOList.find(v => v.platform === selectedItem.platform && v.region === selectedItem.region && v.edition === selectedItem.edition);
                    const defaultVariant = matchingVariant || response.data.productVariantDTOList[0];

                    setSelectedPlatform(defaultVariant.platform);
                    setSelectedRegion(defaultVariant.region);
                    setSelectedEdition(defaultVariant.edition);
                    setCurrentPrice(defaultVariant.price);
                    setCurrentProductImageUrl(defaultVariant.productImageUrl);
                }

            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(`Failed to fetch product details: ${err.response?.status || err.message}`);
                } else {
                    setError('An error occurred while fetching product details');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [slug]);

    const updatePriceAndProductImageUrl = (platform: string, region: string, edition: string) => {
        const variant = productDetails?.productVariantDTOList.find(v => 
            v.platform === platform && v.region === region && v.edition == edition);
        if (variant) {
            setCurrentPrice(variant.price);
            setCurrentProductImageUrl(variant.productImageUrl);
        }
    };

    const handlePlatformChange = (platform: string) => {
        setSelectedPlatform(platform);

        // Reset stock level
        const newStock = productDetails?.productVariantDTOList.find(v => v.platform === platform)?.stock || 0;
        setCurrentStock(newStock);

        // Reset region and edition if not available for new platform
        const availableRegionsForNewPlatform = [...new Set(productDetails?.productVariantDTOList.filter(v => v.platform === platform).map(v => v.region))];

        // Reset to 1st new region if current region not available for new platform
        if (!availableRegionsForNewPlatform.includes(selectedRegion)) {
            const newRegion = availableRegionsForNewPlatform[0] || '';
            setSelectedRegion(newRegion);
            
            // Reset to 1st new edition
            const availableEditionsForNewSelection = [...new Set(productDetails?.productVariantDTOList.filter(v => v.platform === platform && v.region === newRegion).map(v => v.edition))];
            const newEdition = availableEditionsForNewSelection[0] || '';
            setSelectedEdition(newEdition);

            updatePriceAndProductImageUrl(platform, newRegion, newEdition);
        } else {
            // Currently selected region also available for new platform
            const availableEditionsForNewSelection = [...new Set(productDetails?.productVariantDTOList.filter(v => v.platform === platform && v.region === selectedRegion).map(v => v.edition))];
            
            // Reset to 1st new edition if current edition not available for new platform and region
            if (!availableEditionsForNewSelection.includes(selectedEdition)) {
                const newEdition = availableEditionsForNewSelection[0] || '';
                setSelectedEdition(newEdition);

                updatePriceAndProductImageUrl(platform, selectedRegion, newEdition);
            } else {
                // Currently selected edition also available for new platform and region
                updatePriceAndProductImageUrl(platform, selectedRegion, selectedEdition);
            }
        }
    };

    const handleRegionChange = (region: string) => {
        setSelectedRegion(region);

        const availableEditionsForNewSelection = [...new Set(productDetails?.productVariantDTOList.filter(v => v.platform === selectedPlatform && v.region === region).map(v => v.edition))];
        // Reset to 1st new edition if current edition not available for new region
        if (!availableEditionsForNewSelection.includes(selectedEdition)) {
            const newEdition = availableEditionsForNewSelection[0] || '';
            setSelectedEdition(newEdition);
            updatePriceAndProductImageUrl(selectedPlatform, region, newEdition);
        } else {
            updatePriceAndProductImageUrl(selectedPlatform, region, selectedEdition);
        }
    };

    const handleEditionChange = (edition: string) => {
        setSelectedEdition(edition);
        updatePriceAndProductImageUrl(selectedPlatform, selectedRegion, edition);
    };

    // Styling for stock status
    const getStatusStyle = (status: string): CSSProperties => {
        const baseStyle: CSSProperties = {
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            textAlign: 'center',
            display: 'inline-block',
            border: 'none',
        };

    switch(status) {
        case StockStatus.IN_STOCK: return { ...baseStyle, backgroundColor: '#22c55e' };
        case StockStatus.OUT_OF_STOCK: return { ...baseStyle, backgroundColor: '#ef4444' };
        case StockStatus.PRE_ORDER: return { ...baseStyle, backgroundColor: '#3b82f6' };
        default: return { ...baseStyle, backgroundColor: '#6b7280' };
    }
};

    if (loading) {
        return (
            <div className="container">
                <div className="content-center">
                    <div className="loading-message">Loading product details...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="content">
                <div className="error-message">
                    <strong>Error: </strong>
                    <span>{error}</span>
                </div>
                </div>
            </div>
        );
    }

      if (!productDetails || !productDetails.productDTO) {
    return (
      <div className="container">
        <div className="content-center">
          <div className="not-found-message">Product not found</div>
        </div>
      </div>
    );
  }

  const { productDTO } = productDetails;
  const status = getStockStatus(productDTO.releaseDate, currentStock);

  return (
    <div className="product-variant-container">
      <div className="product-variant-section">
            <h1 className="product-title">{productDTO.name}</h1>

            <div className="product-publisher">
                <p>{formatStringGeneral(productDTO.publisher)}</p>
            </div>

            <div className='product-options'>
                <div className='option-group-details'>

                    {/* Platform */}
                    {availableRegions.length > 0 && (
                        <div className='option-group-details option-buttons-details'>
                            <label className='option-label-details'>Platform</label>
                            {availablePlatforms.map(platform => (
                                <button
                                    key={platform}
                                    className={`option-btn ${selectedPlatform === platform ? 'active' : ''}`}
                                    onClick={() => handlePlatformChange(platform)}
                                >
                                    {formatPlatformName(platform)}
                                </button>
                            ))}
                        </div>
                    )}
                    

                    {/* Region */}
                    {availableRegions.length > 0 && (
                        <div className='option-group-details option-buttons-details'>
                            <label className='option-label-details'>Region</label>
                            {availableRegionsForPlatform.map(region => (
                                <button
                                    key={region}
                                    className={`option-btn ${selectedRegion === region ? 'active' : ''}`}
                                    onClick={() => handleRegionChange(region)}
                                >
                                    {formatRegionName(region)}
                                </button>
                            ))}                                
                        </div>
                    )}

                    {/* Edition */}
                    {availableEditions.length > 0 && (
                        <div className='option-group-details option-buttons-details'>
                            <label className='option-label-details'>Edition</label>
                            {availableEditionsForSelection.map(editon => (
                                <button
                                    key={editon}
                                    className={`option-btn ${selectedEdition === editon ? 'active' : ''}`}
                                    onClick={() => handleEditionChange(editon)}
                                >
                                    {formatEditionName(editon)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div style={getStatusStyle(status)}>
                    {getStockStatus(productDTO.releaseDate, currentStock)}
            </div>
          
            <div className="product-description">
            <p>{productDTO.description}</p>
            </div>

            <div className="product-info-section">
            <h3 className="info-title">Product Information</h3>
            </div>
        
      </div>
    </div>
  );
};

export default ProductDetailsPage;