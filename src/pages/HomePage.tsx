import { useState, useEffect } from 'react';
import axios from 'axios';
import PromoCarousel from "../components/PromoCarousel";
import ProductSlider from "../components/ProductSlider";
import { useAuth } from "../components/AuthContext.tsx";

import arrowLeftIcon from "../assets/arrowLeftIcon.png";
import arrowRightIcon from "../assets/arrowRightIcon.png";

interface ProductSliderItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  productImageUrl: string;
}

interface PageResponse {
  content: ProductSliderItem[],
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // current page number
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

function HomePage() {
  const [recommendedItems, setRecommendedItems] = useState<ProductSliderItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userID } = useAuth();

  const api = axios.create({
        baseURL: 'http://localhost:8080/junes/api/v1',
        timeout: 10000,
  });

  const fetchRecommendedItems = async (pageNumber: number) => {
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      console.info(`Fetching data for recommended products for page ${pageNumber} for userID ${userID}...`)

      const response = await api.get<PageResponse>(`/frontpage/recommended?userID=${userID}&page=${pageNumber}`);
      const urlPrefix = "https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/";

      // Append prefix to each productImageUrl
      const updatedData = response.data.content.map((item) => ({
        ...item,
        productImageUrl: item.productImageUrl ? `${urlPrefix}${item.productImageUrl}` : "",
      }));

      setRecommendedItems(updatedData);
      setCurrentPage(response.data.number);
      setTotalPages(response.data.totalPages);
      setHasNextPage(!response.data.last);
      setHasPreviousPage(!response.data.first);

      console.log("Updated state - Current Page:", response.data.number);
      console.log("Updated state - Has Next:", !response.data.last);
      console.log("Updated state - Has Previous:", !response.data.first);
      console.log("Fetched data: ", updatedData)
      // let response;

      // if (isLoggedIn) {
      //   response = await api.get<ProductSliderItem[]>(`/frontpage/recommended?userID=${userID}&pageNumber=${pageNumber}`);
      // } else {
      //   const requestData = {
      //     pageNumber: pageNumber,
      //     historyCache: ["item1"]
      //   };
      //   response = await api.post<ProductSliderItem[]>(`/frontpage/recommended/no-user`, requestData, {headers: {
      //       'Content-Type': 'application/json'
      //     }});
      // }

    } catch (error) {
      console.error('Error fetching data for recommended products (user logged in):', error);
      setError('Error fetching data for recommended products (user logged in): ' + error)
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = async () => {
    if (isLoading || !hasPreviousPage) return;

    const previousPage = currentPage - 1;
    console.log(`Navigating to previous page: ${previousPage} (current: ${currentPage})`);
    
    try {
      await fetchRecommendedItems(previousPage);
    } catch (error) {
      console.error("Error in handlePrevious:", error);
    }
  }

  const handleNext = async () => {
    if (isLoading || !hasNextPage) return;

    const nextPage = currentPage + 1;
    console.log(`Navigating to next page: ${nextPage} (current: ${currentPage})`);
    
    try {
      await fetchRecommendedItems(nextPage);
    } catch (error) {
      console.error("Error in handleNext:", error);
    }
  }

  useEffect(() => {
    console.log("Component mounted, fetching initial data...");
    fetchRecommendedItems(0);
  }, []); // Runs once component mounts


  if (error) {
    return (
      <div className="home-page-container">
        <PromoCarousel />
        <div>Error loading recommended items: {error}</div>
      </div>
    );
  }

  return (
    <div className="home-page-container">
      <PromoCarousel />

      {/* Product Slider Section with Pagination Controls */}
      <div className='product-slider-container'>
      <div className='product-slider-header'>
        <h2>Recommended For You</h2>
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
          <button className={`slider-arrow prev ${isLoading ? 'disabled' : ''}`} onClick={handlePrevious} disabled={isLoading}>
            <img src={arrowLeftIcon} alt="Previous" />
          </button>
        )}

        {/* Product Slider Component */}
        <ProductSlider items={recommendedItems} isLoading={isLoading} />
        
        {/* Next Arrow */}
        {hasNextPage && (
          <button className={`slider-arrow next ${isLoading ? 'disabled' : ''}`} onClick={handleNext} disabled={isLoading}>
            <img src={arrowRightIcon} alt="Next" />
          </button>
        )}
      </div>
    </div>
      
    </div>
  );
}

export default HomePage;