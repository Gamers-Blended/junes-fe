import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { NavigationState } from "../types/navigationState";
import { Order } from "../types/order.ts";
import {
  TransactionHistoryParams,
  TransactionHistoryResponse,
} from "../types/transaction";
import { mockOrderList } from "../mocks/data/orders.ts";
import { mockTransactionHistory } from "../mocks/data/transactions.ts";
import {
  formatDateWithMonthName,
  replaceSpacesWithDash,
} from "../utils/utils.ts";
import { SavedInfoType, Credentials } from "../utils/Enums.tsx";
import { REQUEST_MAPPING, apiClient, getApiErrorMessage } from "../utils/api.ts";
import ProductImageAndDescription from "../components/ProductImageAndDescription";
import Footer from "../components/Footer";

import bookIcon from "../assets/bookIcon.png";
import cardIcon from "../assets/cardIcon.png";

interface MyAccountPageProps {
  offlineMode?: boolean;
}

const MyAccountPage: React.FC<MyAccountPageProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [username, setUsername] = useState<string>("test name");
  const [email, setEmail] = useState<string>("test@junes.com");

  const [transactionHistory, setTransactionHistory] = useState<Order[]>([]);
  const [sortBy, setSortBy] = useState("created_on");
  const [orderBy, setOrderBy] = useState("desc");
  const [pageSize, setPageSize] = useState(10); // Must correspond with 1st option
  const [currentPage, setCurrentPage] = useState(0); // Zero-based index
  const [pageInputValue, setPageInputValue] = useState("1");
  const [pageInfo, setPageInfo] = useState<{
    totalElements: number;
    totalPages: number;
    currentPage: number;
  }>({
    totalElements: 0,
    totalPages: 1,
    currentPage: 0,
  });
  const [logoutError, setLogoutError] = useState<string>("");
  const [transactionHistoryError, setTransactionHistoryError] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingTransactions, setIsLoadingTransactions] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const sortOptions = [
    {
      value: "order-date-asc",
      label: "Order Date ↗",
      sortBy: "orderDate",
      orderBy: "asc",
    },
    {
      value: "order-date-desc",
      label: "Order Date ↘",
      sortBy: "orderDate",
      orderBy: "desc",
    },
    {
      value: "total-amount-asc",
      label: "Total Amount ↗",
      sortBy: "totalAmount",
      orderBy: "asc",
    },
    {
      value: "total-amount-desc",
      label: "Total Amount ↘",
      sortBy: "totalAmount",
      orderBy: "desc",
    },
    {
      value: "status-asc",
      label: "Status (A → Z)",
      sortBy: "status",
      orderBy: "asc",
    },
    {
      value: "status-desc",
      label: "Status (Z → A)",
      sortBy: "status",
      orderBy: "desc",
    },
  ];

  useAuthRedirect(isLoggedIn);

  const fetchTransactionHistory = async () => {
    setIsLoadingTransactions(true);
    setTransactionHistoryError("");

    try {
      const response = await getTransactionHistory({
        page: currentPage,
        size: pageSize,
        sort: `${sortBy},${orderBy}`,
      });

      setTransactionHistory(response.content);
      setPageInfo({
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.number,
      });
    } catch (error) {
      setTransactionHistoryError(
        getApiErrorMessage(
          error,
          "Failed to fetch transaction history. Please try again.",
        ),
      );
      console.error("Error fetching transaction history:", error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, [currentPage, pageSize, sortBy, orderBy]);

  const handleLogOut = async (): Promise<void> => {
    // Clear previous logout error
    setLogoutError("");
    setIsLoading(true);

    if (offlineMode) {
      console.log("Offline mode: Skipping logout API call");
      // Simulate successful logout
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      try {
        await logOut();
      } catch (error) {
        setLogoutError(
          getApiErrorMessage(error, "Logout failed. Please try again."),
        );
        setIsLoading(false);
        return;
      }
    }

    setIsLoggedIn(false);
    console.log("Signed out");
    navigate("/login");
    // No need to set isLoading to false here as we navigate away
  };

  const logOut = async (): Promise<void> => {
    console.log("Calling logout API...");

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("No JWT token found");
    }

    const response = await apiClient.post(
      `${REQUEST_MAPPING}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Logout successful:", response.data);
    return response.data;
  };

  const handleChangeEmail = (): void => {
    console.log("Directing user to change email");
    const state: NavigationState = {
      from: "myaccount",
      fieldToChange: Credentials.EMAIL,
    };
    navigate("/changecredentials/", { state });
  };

  const handleChangePassword = (): void => {
    console.log("Directing user to change password");
    const state: NavigationState = {
      from: "myaccount",
      fieldToChange: Credentials.PASSWORD,
    };
    navigate("/changecredentials/", { state });
  };

  const handleMyAddresses = (): void => {
    console.log("Directing user to my addresses");
    const state: NavigationState = {
      from: "myaccount",
      fieldToChange: SavedInfoType.ADDRESS,
    };
    navigate("/savedinfo/", { state });
  };

  const handleMyPayments = (): void => {
    console.log("Directing user to my payments");
    const state: NavigationState = {
      from: "myaccount",
      fieldToChange: SavedInfoType.PAYMENT,
    };
    navigate("/savedinfo/", { state });
  };

  const getCurrentSortValue = (): string => {
    const currentOption = sortOptions.find(
      (option) => option.sortBy === sortBy && option.orderBy === orderBy,
    );
    return currentOption ? currentOption.value : sortOptions[0].value;
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const selectedOption = sortOptions.find((option) => option.value === value);

    if (!selectedOption) {
      // Fallback to 2nd option if no match found
      const fallbackOption = sortOptions[1];
      setSortBy(fallbackOption.sortBy);
      setOrderBy(fallbackOption.orderBy);
      return;
    }

    setSortBy(selectedOption.sortBy);
    setOrderBy(selectedOption.orderBy);
  };

  const getTransactionHistory = async (
    params?: TransactionHistoryParams,
  ): Promise<TransactionHistoryResponse> => {
    setIsLoadingTransactions(true);

    if (offlineMode) {
      console.log("Offline mode: Skipping get Transaction History API call");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsLoadingTransactions(false);
      return getMockTransactionHistory(params);
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.sort) {
      queryParams.append("sort", params.sort);
    }
    if (params?.size) {
      queryParams.append("size", params.size.toString());
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("No JWT token found");
    }

    try {
      const response = await apiClient.get<TransactionHistoryResponse>(
        `${REQUEST_MAPPING}/transaction/history${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
      );

      setIsLoadingTransactions(false);
      return response.data;
    } catch (error) {
      setTransactionHistoryError(
        getApiErrorMessage(
          error,
          "Failed to fetch transaction history. Please try again.",
        ),
      );
      setIsLoadingTransactions(false);
      console.error("Failed to fetch transaction history:", error);
      throw error;
    }
  };

  const getMockTransactionHistory = (
    params?: TransactionHistoryParams,
  ): TransactionHistoryResponse => {
    let transactions = [...mockOrderList];

    // Apply sorting if provided
    if (params?.sort) {
      transactions = sortMockData(transactions, params.sort);
    }

    // Apply pagination if provided
    if (params?.page !== undefined && params?.size !== undefined) {
      const startIndex = params.page * params.size;
      const endIndex = startIndex + params.size;
      transactions = transactions.slice(startIndex, endIndex);
    }

    return mockTransactionHistory;
  };

  const sortMockData = (transactions: Order[], sortValue: string): Order[] => {
    const sortConfig = parseSortValue(sortValue);
    if (!sortConfig) return transactions;

    const { sortBy, orderBy } = sortConfig;

    return [...transactions].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "orderDate":
          aValue = new Date(a.orderDate).getTime();
          bValue = new Date(b.orderDate).getTime();
          break;
        case "totalAmount":
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (orderBy === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const parseSortValue = (
    sortValue: string,
  ): { sortBy: string; orderBy: string } | null => {
    const sortOption = sortOptions.find((option) => option.value === sortValue);

    return sortOption
      ? { sortBy: sortOption.sortBy, orderBy: sortOption.orderBy }
      : null;
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(0); // Reset to first page
    setPageInputValue("1"); // Reset input to first page
  };

  const getStatusClass = (status: string): string => {
    return `status-badge status-${replaceSpacesWithDash(status.toLowerCase())}`;
  };

  const getItemRange = () => {
    const start = currentPage * pageSize + 1;
    const end = Math.min(
      start + transactionHistory.length - 1,
      pageInfo.totalElements,
    );
    return { start, end };
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setPageInputValue((newPage + 1).toString()); // Update input to match new page
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageInfo.totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setPageInputValue((newPage + 1).toString()); // Update input to match new page
    }
  };

  const handlePageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputValue = event.target.value;

    // Allow empty string OR strings containing only digits (but can be partial)
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      setPageInputValue(inputValue);
    }
  };

  const handlePageJump = () => {
    // If empty, reset to current page (don't jump anywhere)
    if (pageInputValue === "" || pageInputValue.trim() === "") {
      setPageInputValue((currentPage + 1).toString());
      return;
    }

    const pageNumber = parseInt(pageInputValue, 10);

    // Validate page number
    if (isNaN(pageNumber) || pageNumber < 1) {
      setPageInputValue((currentPage + 1).toString());
      return;
    }

    // Clamp between 1 and total pages
    const clampedPage = Math.max(1, Math.min(pageNumber, pageInfo.totalPages));

    // Update current page and input value
    if (clampedPage - 1 !== currentPage) {
      setCurrentPage(clampedPage - 1); // Convert to zero-based index
    }
    setPageInputValue(clampedPage.toString());
  };

  const handlePageInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      handlePageJump();
    }
  };

  const handlePageInputBlur = () => {
    handlePageJump();
  };

  const handleViewOrderDetails = (orderId: string) => {
    const url = `/order/${orderId}`;
    console.log(`Navigating to order details for ${orderId}`);
    navigate(url);
  };

  const handlePrintInvoice = (orderId: string) => {
    const url = `/invoice/${orderId}`;
    console.log(`Navigating to invoice page for ${orderId}`);
    navigate(url);
  };

  return (
    <div className="my-account-page-container">
      <div className="my-account-content">
        <div className="my-account-left">
          <div className="common-header">
            <h1>MY ACCOUNT</h1>
          </div>

          <div className="my-account-details">
            <p>
              <strong>Username:</strong> {username}
              <br />
              <strong>Email:</strong> {email}
            </p>
          </div>

          <div className="my-account-actions">
            <div className="my-account-actions-button-row">
              <button
                className={`form-button ${isLoading ? "loading" : ""}`}
                onClick={handleLogOut}
                disabled={isLoading}
              >
                {isLoading ? "Logging Out..." : "Log Out"}
              </button>
            </div>

            <div className="my-account-actions-button-row">
              <button
                className="form-button"
                onClick={handleChangeEmail}
                disabled={isLoading}
              >
                Change Email
              </button>

              <button
                className="form-button"
                onClick={handleChangePassword}
                disabled={isLoading}
              >
                Change Password
              </button>
            </div>
          </div>

          {logoutError && <div className="error-message">{logoutError}</div>}
        </div>

        <div className="my-account-right">
          <div className="feature-card" onClick={handleMyAddresses}>
            <div className="feature-card-top">
              <img src={bookIcon} className="feature-icon" alt="address" />
              <h2>My Addresses</h2>
            </div>
            <div className="feature-card-bottom">
              Edit, remove or set default address
            </div>
          </div>

          <div className="feature-card" onClick={handleMyPayments}>
            <div className="feature-card-top">
              <img src={cardIcon} className="feature-icon" alt="payment" />
              <h2>My Payments</h2>
            </div>
            <div className="feature-card-bottom">
              Manage or add payment methods
            </div>
          </div>
        </div>
      </div>

      <div className="my-orders-content">
        <div className="align-left">
          <h2>Your Orders</h2>
        </div>

        {/* Content Controls */}
        <div className="content-controls-row">
          <div className="content-controls-group">
            <label className="filter-label">Sort By</label>
            <select
              className="filter-select"
              value={getCurrentSortValue()}
              onChange={handleSortChange}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="content-controls-group">
            <label className="filter-label">Transactions Per Page</label>
            <select
              className="filter-select"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="transactions-table">
          {transactionHistoryError ? (
            <div className="error-message">{transactionHistoryError}</div>
          ) : isLoadingTransactions ? (
            <div className="loading-message">
              <p>Loading transactions...</p>
            </div>
          ) : transactionHistory.length === 0 ? (
            <div className="no-transactions-message">
              <p>No transactions found</p>
            </div>
          ) : (
            <>
              {transactionHistory.map((transaction) => (
                <div key={transaction.orderNumber} className="transaction-card">
                  {/* Transactions Table - Header */}
                  <div className="transaction-header">
                    <div className="transaction-header-left">
                      <div className="transaction-info-group">
                        <span className="transaction-label">ORDER DATE</span>
                        <span className="transaction-value">
                          {formatDateWithMonthName(transaction.orderDate)}
                        </span>
                      </div>

                      <div className="transaction-info-group">
                        <span className="transaction-label">TOTAL</span>
                        <span className="transaction-value">
                          ${transaction.totalAmount.toFixed(2)}
                        </span>
                      </div>

                      <div className="transaction-info-group status-group">
                        <span className={getStatusClass(transaction.status)}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>

                    <div className="transaction-header-right">
                      <div className="transaction-info-group">
                        <span className="transaction-label">ORDER #</span>
                        <span className="transaction-value">
                          {transaction.orderNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transactions Table - Items */}
                  <div className="transaction-items">
                    <div className="item-actions">
                      <button
                        className="action-link"
                        onClick={() =>
                          handleViewOrderDetails(transaction.orderNumber)
                        }
                      >
                        View order details
                      </button>
                      <button
                        className="action-link"
                        onClick={() =>
                          handlePrintInvoice(transaction.orderNumber)
                        }
                      >
                        Print invoice
                      </button>
                    </div>

                    {transaction.transactionItemDTOList.map((item) => (
                      <ProductImageAndDescription
                        item={item}
                        mode="transactionHistory"
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Transaction Count Info with Pagination */}
              <div className="products-info">
                <div className="products-count">
                  Showing {getItemRange().start} - {getItemRange().end} of{" "}
                  {pageInfo.totalElements} Transactions
                </div>

                <div className="pagination-controls">
                  {currentPage > 0 && (
                    <button
                      className="pagination-btn"
                      onClick={handlePreviousPage}
                    >
                      ⮜ Previous
                    </button>
                  )}

                  <div className="page-info">
                    Page{" "}
                    <input
                      type="number"
                      min={1}
                      max={pageInfo.totalPages}
                      value={pageInputValue}
                      onChange={handlePageInputChange}
                      onKeyDown={handlePageInputKeyDown}
                      onBlur={handlePageInputBlur}
                      className="common-input-box"
                    />{" "}
                    / {pageInfo.totalPages}
                  </div>

                  {currentPage < pageInfo.totalPages - 1 && (
                    <button className="pagination-btn" onClick={handleNextPage}>
                      Next ➤
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyAccountPage;
