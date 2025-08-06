import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductSliderItem, PageResponse } from '../types/products.ts';
import ProductCard from './ProductCard';
import { useAuth } from "../components/AuthContext.tsx";
import arrowLeftIcon from "../assets/arrowLeftIcon.png";
import arrowRightIcon from "../assets/arrowRightIcon.png";

interface ProductSliderProps {
  title: string;
}

/**
 * Component that displays products with arrows
 * @para title - Name of API to call
 * @returns ProductSlider component with the given list of ProductSliderItem
 */
const ProductSlider: React.FC<ProductSliderProps> = ({ title }) => {
  const [items, setItems] = useState<ProductSliderItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userID, isLoggedIn } = useAuth();

  const api = axios.create({
        baseURL: 'http://localhost:8080/junes/api/v1',
        timeout: 10000,
  });

  const fetchItems = async (pageNumber: number) => {
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      let response;

      switch (title) {
        case "Recommended For You":
          if (isLoggedIn) {
            console.info(`Fetching ${title} data for page ${pageNumber} for userID ${userID}...`);

            response = await api.get<PageResponse<ProductSliderItem>>(`/frontpage/recommended?userID=${userID}&page=${pageNumber}`);
          } else {
              console.info(`Fetching ${title} data for page ${pageNumber} for guest user...`);

              const requestData = {
                pageNumber: pageNumber,
                historyCache: ["item1"] // TODO: get from history cache
              };

              response = await api.post<PageResponse<ProductSliderItem>>(`/frontpage/recommended/no-user?page=${pageNumber}`, requestData, {headers: {
                  'Content-Type': 'application/json'
              }});
          }
          break;

        case "Preorders":
          console.info(`Fetching ${title} data for page ${pageNumber}`);

          const referenceDate = "2023-01-01"; // TODO get from DebugWindow

          response = await api.get<PageResponse<ProductSliderItem>>(`/frontpage/preorders?page=${pageNumber}&currentDate=${referenceDate}`);
          break;

        case "Best Sellers":
          console.info(`Fetching ${title} data for page ${pageNumber}`);

          response = await api.get<PageResponse<ProductSliderItem>>(`/frontpage/best-sellers?page=${pageNumber}`);
          break;
        
        default:
          console.info(`Invalid title given, fetching best-seller data for page ${pageNumber} as default`);

          response = await api.get<PageResponse<ProductSliderItem>>(`/frontpage/best-sellers?page=${pageNumber}`);
      }

      const urlPrefix = "https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/";

      // Append prefix to each productImageUrl
      const updatedData = response.data.content.map((item) => ({
        ...item,
        productImageUrl: item.productImageUrl ? `${urlPrefix}${item.productImageUrl}` : "",
      }));

      setItems(updatedData);
      setCurrentPage(response.data.number);
      setHasNextPage(!response.data.last);
      setHasPreviousPage(!response.data.first);

      console.log("Updated state - Current Page:", response.data.number);
      console.log("Updated state - Has Next:", !response.data.last);
      console.log("Updated state - Has Previous:", !response.data.first);
      console.log("Fetched data: ", updatedData)

    } catch (error) {
      console.error(`Error fetching ${title} data:`, error);
      setError(`Error fetching ${title} data: ` + error)
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = async () => {
    if (isLoading || !hasPreviousPage) return;

    const previousPage = currentPage - 1;
    console.log(`${title} - Navigating to previous page: ${previousPage} (current: ${currentPage})`);
    
    try {
      await fetchItems(previousPage);
    } catch (error) {
      console.error(`${title} - Error in handlePrevious:`, error);
    }
  }

  const handleNext = async () => {
    if (isLoading || !hasNextPage) return;

    const nextPage = currentPage + 1;
    console.log(`${title} - Navigating to next page: ${nextPage} (current: ${currentPage})`);
    
    try {
      await fetchItems(nextPage);
    } catch (error) {
      console.error(`${title} - Error in handleNext:`, error);
    }
  };

  useEffect(() => {
    console.log(`${title} - Component mounted, fetching initial data...`);
    fetchItems(0);
  }, []); // Runs once component mounts

  if (error) {
    return (
      <div className='product-slider-container'>
        <div className='product-slider-header'>
          <h2>{title}</h2>
        </div>
        <div>Error loading items: {error}</div>
      </div>
    );
  }

  return (
      <div className='product-slider-container'>

        {/* Header */}
        <div className='product-slider-header'>
          <h2>{title}</h2>
        </div>

        <div className='product-slider-items-container'>
          {/* Loading Placeholder */}
          {isLoading && (
            <div className='product-slider-loading-placeholder'>
              <div className='product-slider-loading-spinner'></div>
              <div className='product-slider-loading-text'>Loading items...</div>
            </div>
          )}

          {/* Previous Arrow */}
          {hasPreviousPage && (
            <button 
              className={`slider-arrow prev ${isLoading ? 'disabled' : ''}`} 
              onClick={handlePrevious} 
              disabled={isLoading}>
            <img src={arrowLeftIcon} alt="Previous" />
            </button>
          )}

          {/* Product Slider Component */}
          <div className='product-slider-items'>
            {items.map((item) => (
              <ProductCard key={item.id} item={item} isLoading={isLoading} />
            ))}
          </div>
          
          {/* Next Arrow */}
          {hasNextPage && (
            <button 
              className={`slider-arrow next ${isLoading ? 'disabled' : ''}`} 
              onClick={handleNext} 
              disabled={isLoading}>
            <img src={arrowRightIcon} alt="Next" />
            </button>
          )}
        </div>

      </div>
  );
};

export default ProductSlider;