import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { formatPlatformName, formatRegionName, formatEditionName } from '../utils/utils.ts';


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
    imageUrlList: string[];
    editionNotes: string;
    createdOn: string;
}

interface ProductVariantDTO {
    platform: string;
    region: string;
    edition: string;
    price: number;
    productImageUrl: string;
}

interface ProductDetailsDTO {
    productDTO: ProductDTO;
    productVariantDTOList: ProductVariantDTO[];
}

const ProductDetailsPage: React.FC = () => {
    const { slug } = useParams();
    const [productDetails, setProductDetails] = useState<ProductDetailsDTO | null>(null);
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
                const response = await axios.get<ProductDetailsDTO>(
                    `http://localhost:8080/junes/api/v1/product/details/${slug}`
                );
                setProductDetails(response.data);
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

  return (
    <div className="product-variant-container">
      <div className="product-variant-section">
            <h1 className="product-title">{productDTO.name}</h1>

            <div className="product-publisher">
                <p>{productDTO.publisher}</p>
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
                                >
                                    {formatEditionName(editon)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
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