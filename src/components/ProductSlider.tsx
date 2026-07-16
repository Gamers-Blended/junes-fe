import React, { useState, useEffect } from "react";
import { ProductSliderItem } from "../types/products.ts";
import { RecommendedProductRequestDTO } from "../types/recommendations.ts";
import { Page } from "../types/page.ts";
import ProductCard from "./ProductCard";
import { appendUrlPrefix } from "../utils/utils.ts";
import { mockProductSliderItems } from "../mocks/data/productSlider.ts";
import {
  REQUEST_MAPPING,
  apiClient,
  getApiErrorMessage,
} from "../utils/api.ts";
import { useAuth } from "../components/AuthContext.tsx";
import { useDebug } from "../components/DebugContext.tsx";
import { useBrowsingCache } from "../store/browsingCache";

import arrowLeftIcon from "../assets/arrowLeftIcon.png";
import arrowRightIcon from "../assets/arrowRightIcon.png";
import { toLocalDateInputValue } from "../utils/dateUtils.ts";

interface ProductSliderProps {
  offlineMode?: boolean;
  title: string;
}

/**
 * Component that displays products with arrows
 * @para title - Name of API to call
 * @returns ProductSlider component with the given list of ProductSliderItem
 */
const ProductSlider: React.FC<ProductSliderProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
  title,
}) => {
  const [items, setItems] = useState<ProductSliderItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { isLoggedIn } = useAuth();
  const { debugDate } = useDebug();
  const { history } = useBrowsingCache();

  const fetchItems = async (pageNumber: number) => {
    setIsLoading(true);
    setErrorMessage(""); // Clear any previous errors

    try {
      const response = await getProductSliderItems(pageNumber);

      const imageUrls = response.content.map(
        (item) => item.productImageUrl || "",
      );
      const prefixedUrls = appendUrlPrefix(imageUrls);

      const updatedData = response.content.map((item, index) => ({
        ...item,
        productImageUrl: prefixedUrls[index],
      }));

      setItems(updatedData);
      setCurrentPage(response.number);
      setHasNextPage(!response.last);
      setHasPreviousPage(!response.first);

      console.log("Updated state - Current Page:", response.number);
      console.log("Updated state - Has Next:", !response.last);
      console.log("Updated state - Has Previous:", !response.first);
      console.log("Fetched data: ", updatedData);
    } catch (error) {
      console.error(`Error fetching ${title} data:`, error);
      setErrorMessage(
        getApiErrorMessage(error, `Error fetching ${title} data: ` + error),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getProductSliderItems = async (
    pageNumber: number,
  ): Promise<Page<ProductSliderItem>> => {
    if (offlineMode) {
      console.log("Offline mode: using mock product slider items");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        content: mockProductSliderItems,
        number: 0,
        size: mockProductSliderItems.length,
        totalElements: mockProductSliderItems.length,
        totalPages: 1,
        first: true,
        last: true,
        sort: {
          sorted: false,
          unsorted: true,
          empty: false,
        },
        numberOfElements: mockProductSliderItems.length,
      };
    }

    let response;
    switch (title) {
      case "Recommended For You":
        console.info(
          `Fetching ${title} data for page ${pageNumber} for ${
            isLoggedIn ? `logged user` : "guest user"
          }...`,
        );

        const requestData: RecommendedProductRequestDTO = {
          historyCache: history.slice(0, 10).map((entry) => ({
            productID: entry.productID,
            viewAt: new Date(entry.viewedAt).toISOString(),
          })),
        };

        response = await apiClient.post<Page<ProductSliderItem>>(
          `${REQUEST_MAPPING}/frontpage/recommended`,
          requestData,
          {
            params: {
              page: pageNumber,
            },
          },
        );

        break;

      case "Preorders":
        console.info(`Fetching ${title} data for page ${pageNumber}`);

        const referenceDate = debugDate
          ? toLocalDateInputValue(debugDate)
          : "2023-01-01";

        response = await apiClient.get<Page<ProductSliderItem>>(
          `/junes/api/v1/frontpage/preorders`,
          {
            params: {
              page: pageNumber,
              currentDate: referenceDate,
            },
          },
        );
        break;

      case "Best Sellers":
        console.info(`Fetching ${title} data for page ${pageNumber}`);

        response = await apiClient.get<Page<ProductSliderItem>>(
          `/junes/api/v1/frontpage/best-sellers`,
          {
            params: {
              page: pageNumber,
            },
          },
        );
        break;

      default:
        console.info(
          `Invalid title given, fetching best-seller data for page ${pageNumber} as default`,
        );

        response = await apiClient.get<Page<ProductSliderItem>>(
          `/junes/api/v1/frontpage/best-sellers`,
          {
            params: {
              page: pageNumber,
            },
          },
        );
        break;
    }

    return response.data;
  };

  const handlePrevious = async () => {
    if (isLoading || !hasPreviousPage) return;

    const previousPage = currentPage - 1;
    console.log(
      `${title} - Navigating to previous page: ${previousPage} (current: ${currentPage})`,
    );

    try {
      await fetchItems(previousPage);
    } catch (error) {
      console.error(`${title} - Error in handlePrevious:`, error);
    }
  };

  const handleNext = async () => {
    if (isLoading || !hasNextPage) return;

    const nextPage = currentPage + 1;
    console.log(
      `${title} - Navigating to next page: ${nextPage} (current: ${currentPage})`,
    );

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

  if (errorMessage) {
    return (
      <div className="product-slider-container">
        <div className="product-slider-header">
          <h2>{title}</h2>
        </div>
        <div>Error loading items: {errorMessage}</div>
      </div>
    );
  }

  return (
    <div className="product-slider-container">
      {/* Header */}
      <div className="product-slider-header">
        <h2>{title}</h2>
      </div>

      <div className="product-slider-items-container">
        {/* Loading Placeholder */}
        {isLoading && (
          <div className="product-slider-loading-placeholder">
            <div className="product-slider-loading-spinner"></div>
            <div className="product-slider-loading-text">Loading items...</div>
          </div>
        )}

        {/* Previous Arrow */}
        {hasPreviousPage && (
          <button
            className={`slider-arrow prev ${isLoading ? "disabled" : ""}`}
            onClick={handlePrevious}
            disabled={isLoading}
          >
            <img src={arrowLeftIcon} alt="Previous" />
          </button>
        )}

        {/* Product Slider Component */}
        <div className="product-slider-items">
          {items.map((item) => (
            <ProductCard
              key={item.productID}
              Item={item}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Next Arrow */}
        {hasNextPage && (
          <button
            className={`slider-arrow next ${isLoading ? "disabled" : ""}`}
            onClick={handleNext}
            disabled={isLoading}
          >
            <img src={arrowRightIcon} alt="Next" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductSlider;
