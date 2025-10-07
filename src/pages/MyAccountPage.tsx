import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { NavigationState } from "../types/navigationState";

import bookIcon from "../assets/bookIcon.png";
import cardIcon from "../assets/cardIcon.png";

interface OrderItem {
  id: string;
  name: string;
  platform: string;
  region: string;
  edition: string;
  quantity: number;
  imageUrl: string;
}

interface Transaction {
  id: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  orderNumber: string;
  items: OrderItem[];
}

const MyAccountPage: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("test name");
  const [email, setEmail] = useState<string>("test@junes.com");
  const [sortBy, setSortBy] = useState("created_on");
  const [orderBy, setOrderBy] = useState("desc");
  const [transactionsPerPage, setTransactionsPerPage] = useState(10); // Must correspond with 1st option
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInputValue, setPageInputValue] = useState("1");
  const [pageInfo, setPageInfo] = useState<{
    totalElements: number;
    totalPages: number;
    currentPage: number;
  }>({
    totalElements: 3,
    totalPages: 1,
    currentPage: 0,
  });

  // Dummy transaction data
  const dummyTransactions: Transaction[] = [
    {
      id: "1",
      orderDate: "21 September 2025",
      totalAmount: 10.0,
      status: "PAID",
      orderNumber: "J123456789",
      items: [
        {
          id: "1",
          name: "Final Fantasy X | X-2 HD Remaster",
          platform: "Nintendo Switch",
          region: "Japan",
          edition: "Standard",
          quantity: 1,
          imageUrl:
            "https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_atelier_marie_remake.jpg",
        },
        {
          id: "2",
          name: "SaGa: Scarlet Grace Ambitions",
          platform: "Nintendo Switch",
          region: "Asia",
          edition: "Standard",
          quantity: 1,
          imageUrl:
            "https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_atelier_marie_remake.jpg",
        },
      ],
    },
    {
      id: "2",
      orderDate: "15 September 2025",
      totalAmount: 45.5,
      status: "SHIPPED",
      orderNumber: "J987654321",
      items: [
        {
          id: "3",
          name: "The Legend of Zelda: Tears of the Kingdom",
          platform: "Nintendo Switch",
          region: "US",
          edition: "Collector's Edition",
          quantity: 1,
          imageUrl:
            "https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_atelier_marie_remake.jpg",
        },
      ],
    },
    {
      id: "3",
      orderDate: "10 September 2025",
      totalAmount: 89.99,
      status: "CANCELLED",
      orderNumber: "J456789123",
      items: [
        {
          id: "4",
          name: "Persona 5 Royal",
          platform: "PlayStation 5",
          region: "Europe",
          edition: "Deluxe",
          quantity: 2,
          imageUrl: "/placeholder-persona.jpg",
        },
      ],
    },
  ];

  const sortOptions = [
    {
      value: "order-date-asc",
      label: "Order Date ↗",
      sortBy: "created_on",
      orderBy: "asc",
    },
    {
      value: "order-date-desc",
      label: "Order Date ↘",
      sortBy: "created_on",
      orderBy: "desc",
    },
    {
      value: "total-amount-asc",
      label: "Total Amount ↗",
      sortBy: "total_amount",
      orderBy: "asc",
    },
    {
      value: "total-amount-desc",
      label: "Total Amount ↘",
      sortBy: "total_amount",
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

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, []);

  const handleLogOut = (): void => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleChangeEmail = (): void => {
    console.log("Directing user to change email");
    const state: NavigationState = {
      from: "myaccount",
      fieldToChange: "email",
    };
    navigate("/changecredentials/", { state });
  };

  const handleChangePassword = (): void => {
    console.log("Directing user to change password");
    const state: NavigationState = {
      from: "myaccount",
      fieldToChange: "password",
    };
    navigate("/changecredentials/", { state });
  };

  const handleMyAddresses = (): void => {
    console.log("Directing user to my addresses");
    const state: NavigationState = {
      from: "myaccount",
      fieldToChange: "address",
    };
    navigate("/changesavedinfo/", { state });
  };

  const handleMyPayments = (): void => {
    console.log("Directing user to my payments");
    const state: NavigationState = {
      from: "myaccount",
      fieldToChange: "payment",
    };
    navigate("/changesavedinfo/", { state });
  };

  const getCurrentSortValue = (): string => {
    const currentOption = sortOptions.find(
      (option) => option.sortBy === sortBy && option.orderBy === orderBy
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

  const handleTransactionsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTransactionsPerPage(Number(event.target.value));
  };

  const getStatusClass = (status: string): string => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const getItemRange = () => {
    const start = currentPage * transactionsPerPage + 1;
    const end = Math.min(
      start + dummyTransactions.length - 1,
      pageInfo.totalElements
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
    event: React.ChangeEvent<HTMLInputElement>
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
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handlePageJump();
    }
  };

  const handlePageInputBlur = () => {
    handlePageJump();
  };

  return (
    <div className="my-account-page-container">
      <div className="my-account-content">
        <div className="my-account-left">
          <div className="my-account-header">
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
              <button className="form-button" onClick={handleLogOut}>
                Log Out
              </button>
            </div>

            <div className="my-account-actions-button-row">
              <button className="form-button" onClick={handleChangeEmail}>
                Change Email
              </button>

              <button className="form-button" onClick={handleChangePassword}>
                Change Password
              </button>
            </div>
          </div>
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
        <div className="my-account-header align-left">
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
              value={transactionsPerPage}
              onChange={handleTransactionsPerPageChange}
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
          {dummyTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-card">
              {/* Transactions Table - Header */}
              <div className="transaction-header">
                <div className="transaction-header-left">
                  <div className="transaction-info-group">
                    <span className="transaction-label">ORDER DATE</span>
                    <span className="transaction-value">
                      {transaction.orderDate}
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
                  <button className="action-link">View order details</button>
                  <button className="action-link">Print invoice</button>
                </div>

                {transaction.items.map((item) => (
                  <div key={item.id} className="transaction-item">
                    <div className="transaction-item-image-wrapper">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="transaction-item-image"
                      />
                    </div>
                    <div className="transaction-item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-details">{item.platform}</p>
                      <p className="item-details">{item.region}</p>
                      <p className="item-details">{item.edition}</p>
                      <p className="item-quantity">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Transaction Count Info with Pagination */}
        <div className="products-info">
          <div className="products-count">
            Showing {getItemRange().start} - {getItemRange().end} of{" "}
            {pageInfo.totalElements} Transactions
          </div>

          <div className="pagination-controls">
            {currentPage > 0 && (
              <button className="pagination-btn" onClick={handlePreviousPage}>
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
      </div>
    </div>
  );
};

export default MyAccountPage;
