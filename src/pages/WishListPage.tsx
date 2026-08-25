import { useEffect, useState } from "react";
import { Page } from "../types/page.ts";
import { ProductInWishlistDTO } from "../types/productInWishlistDTO.ts";
import WishlistItemRow from "../components/WishlistItemRow";
import Footer from "../components/Footer";
import NotificationPopUp from "../components/NotificationPopUp";
import { mockWishlistItemList } from "../mocks/data/productInWishlistDTO.ts";
import {
  REQUEST_MAPPING,
  apiClient,
  getApiErrorMessage,
} from "../utils/api.ts";

interface WishListPageProps {
  offlineMode?: boolean;
}

const WishListPage: React.FC<WishListPageProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const [wishlistItems, setWishlistItems] = useState<ProductInWishlistDTO[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageInfo, setPageInfo] = useState<{
    totalElements: number;
    totalPages: number;
  }>({
    totalElements: 0,
    totalPages: 0,
  });
  const [addingToCartID, setAddingToCartID] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [messageMode, setMessageMode] = useState<string>("success");
  const itemsPerPage = 15;

  // Functions that make API calls
  const getWishlistProducts = async (
    page: number,
  ): Promise<Page<ProductInWishlistDTO>> => {
    if (offlineMode) {
      console.log("Offline mode: using mock wishlist items");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        content: mockWishlistItemList,
        totalPages: 1,
        totalElements: mockWishlistItemList.length,
        size: mockWishlistItemList.length,
        number: 0,
        sort: { sorted: false, unsorted: true, empty: true },
        first: true,
        last: true,
        numberOfElements: mockWishlistItemList.length,
      };
    }

    console.log("Fetching wish list items from API...");
    const response = await apiClient.get<Page<ProductInWishlistDTO>>(
      `${REQUEST_MAPPING}/wishlist/products`,
      { params: { page, size: itemsPerPage } },
    );

    return response.data;
  };

  const fetchWishlistItems = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const page = await getWishlistProducts(currentPage);
      setWishlistItems(page.content);
      setPageInfo({
        totalElements: page.totalElements,
        totalPages: page.totalPages,
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Failed to load wish list items"),
      );
      console.error("Error fetching wish list items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, [currentPage]);

  const callRemoveWishlistItemAPI = async (productID: string) => {
    if (offlineMode) {
      console.log("Offline mode: simulating wish list item removal");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return;
    } else {
      console.log("Removing wish list item from API");
      await apiClient.delete(
        `${REQUEST_MAPPING}/wishlist/remove/${productID}`,
      );
    }
  };

  const handleRemoveItem = async (productID: string) => {
    setErrorMessage("");

    try {
      await callRemoveWishlistItemAPI(productID);
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== productID),
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Failed to remove item from wish list"),
      );
      console.error("Error removing wish list item:", error);
    }
  };

  const addToCart = async (
    wishlistItem: ProductInWishlistDTO,
    quantity: number,
  ): Promise<string> => {
    if (offlineMode) {
      console.log("Offline mode: Skipping add to cart API call");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      console.log("Calling API to add to cart with id:", wishlistItem.id);

      const requestBody = {
        productID: wishlistItem.id,
        price: wishlistItem.price,
        quantity,
        createdOn: new Date().toISOString(),
      };

      await apiClient.post(`${REQUEST_MAPPING}/cart/add`, requestBody);
    }

    const message = `${wishlistItem.name} added to cart!`;
    console.log(`${wishlistItem.name} added to cart!`);

    return message;
  };

  const handleAddToCart = async (
    wishlistItem: ProductInWishlistDTO,
    quantity: number,
  ) => {
    setNotificationMessage("");
    setAddingToCartID(wishlistItem.id);

    try {
      const message = await addToCart(wishlistItem, quantity);
      setNotificationMessage(message);
      setMessageMode("success");

      // Remove from wish list now that it's in the cart
      try {
        await callRemoveWishlistItemAPI(wishlistItem.id);
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.id !== wishlistItem.id),
        );
      } catch (removeError) {
        console.error(
          "Error removing item from wish list after adding to cart:",
          removeError,
        );
      }
    } catch (error) {
      setNotificationMessage(
        getApiErrorMessage(
          error,
          "Failed to add item to cart. Please try again.",
        ),
      );
      setMessageMode("error");
      console.error("Error adding item to cart:", error);
    } finally {
      setAddingToCartID(null);
      setShowNotification(true);
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageInfo.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="wishlist-page-container">
      <div className="common-header">
        <h1>MY WISHLIST</h1>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {isLoading ? (
        <div className="loading-message">Loading wish list items...</div>
      ) : wishlistItems.length === 0 ? (
        <div className="empty-cart-message-box">Your wish list is empty</div>
      ) : (
        <div className="cart-items-list">
          {wishlistItems.map((wishlistItem) => (
            <WishlistItemRow
              key={wishlistItem.id}
              wishlistItem={wishlistItem}
              onRemove={handleRemoveItem}
              onAddToCart={handleAddToCart}
              isAddingToCart={addingToCartID === wishlistItem.id}
            />
          ))}
        </div>
      )}

      {pageInfo.totalPages > 1 && (
        <div className="products-info">
          <div className="products-count">
            {pageInfo.totalElements} item
            {pageInfo.totalElements === 1 ? "" : "s"} in wish list
          </div>

          <div className="pagination-controls">
            {currentPage > 0 && (
              <button className="pagination-btn" onClick={handlePreviousPage}>
                ⮜ Previous
              </button>
            )}

            <div className="page-info">
              Page {currentPage + 1} / {pageInfo.totalPages}
            </div>

            {currentPage < pageInfo.totalPages - 1 && (
              <button className="pagination-btn" onClick={handleNextPage}>
                Next ➤
              </button>
            )}
          </div>
        </div>
      )}

      <NotificationPopUp
        message={notificationMessage}
        isVisible={showNotification}
        onClose={handleCloseNotification}
        duration={3000}
        mode={messageMode === "error" ? "error" : "success"}
      />

      <Footer />
    </div>
  );
};

export default WishListPage;
