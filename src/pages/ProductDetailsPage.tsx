import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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
    <div className="container">
      <div className="content">
        <div className="product-card">
          <h1 className="product-title">
            {productDTO.name}
          </h1>
          
          <div className="product-description">
            <p>{productDTO.description}</p>
          </div>

          <div className="product-info-section">
            <h3 className="info-title">Product Information</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;