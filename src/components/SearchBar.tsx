import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setSelectedItem } from "../store/productSlice";
import {
  apiClient,
  REQUEST_MAPPING,
  getApiErrorMessage,
} from "../utils/api.ts";
import { appendUrlPrefix, formatPrice } from "../utils/utils.ts";
import { ProductSliderItem } from "../types/products";
import { useDebounce } from "../hooks/useDebounce";
import { mockProductSliderItems } from "../mocks/data/productSlider";

const SEARCH_RESULT_LIMIT = 10;
const DEBOUNCE_DELAY_MS = 300;

interface SearchBarProps {
  offlineMode?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<ProductSliderItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const trimmedQuery = query.trim();
  const debouncedQuery = useDebounce(trimmedQuery, DEBOUNCE_DELAY_MS);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Fetch results whenever the debounced query changes
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsLoading(false);
      setError("");
      setHighlightedIndex(-1);
      return;
    }

    const abortController = new AbortController();

    const fetchResults = async () => {
      setIsLoading(true);
      setError("");

      try {
        let matches: ProductSliderItem[];

        if (offlineMode) {
          console.log("Offline mode: using mock search results");
          await new Promise((resolve) => setTimeout(resolve, 300));
          matches = mockProductSliderItems.filter((item) =>
            item.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
          );
        } else {
          const response = await apiClient.get<ProductSliderItem[]>(
            `${REQUEST_MAPPING}/product/search`,
            {
              params: { q: debouncedQuery, limit: SEARCH_RESULT_LIMIT },
              signal: abortController.signal,
            },
          );
          matches = response.data;
        }

        matches = matches.map((item) => ({
          ...item,
          productImageUrl: appendUrlPrefix(item.productImageUrl),
        }));

        setResults(matches.slice(0, SEARCH_RESULT_LIMIT));
        setHighlightedIndex(-1);
      } catch (err) {
        if (axios.isCancel(err)) {
          return;
        }
        console.error("Error fetching search results:", err);
        setError(getApiErrorMessage(err, "Unable to load search results."));
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();

    return () => {
      abortController.abort();
    };
  }, [debouncedQuery, offlineMode]);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setIsOpen(value.trim().length > 0);
  };

  const handleSelectResult = (item: ProductSliderItem) => {
    dispatch(setSelectedItem(item));
    navigate(`/games/${item.slug}`);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      return;
    }

    if (!isOpen || results.length === 0) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter": {
        event.preventDefault();
        const selected = results[highlightedIndex >= 0 ? highlightedIndex : 0];
        if (selected) {
          handleSelectResult(selected);
        }
        break;
      }
      default:
        break;
    }
  };

  const showPanel = isOpen && trimmedQuery.length > 0;

  return (
    <div className="nav-search-bar-container" ref={containerRef}>
      <input
        type="text"
        placeholder="Search..."
        className="nav-search-bar"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(trimmedQuery.length > 0)}
        onKeyDown={handleKeyDown}
        aria-label="Search products"
        role="combobox"
        aria-expanded={showPanel}
        aria-autocomplete="list"
        aria-controls="search-results-list"
      />

      {showPanel && (
        <div className="search-results-panel">
          {isLoading && (
            <div className="search-results-loading">
              <div className="search-results-spinner"></div>
            </div>
          )}

          {!isLoading && error && (
            <div className="search-results-error">{error}</div>
          )}

          {!isLoading && !error && results.length === 0 && (
            <div className="search-results-empty">
              No products found for &quot;{trimmedQuery}&quot;
            </div>
          )}

          {!isLoading && !error && results.length > 0 && (
            <ul
              className="search-results-list"
              id="search-results-list"
              role="listbox"
            >
              {results.map((item, index) => (
                <li
                  key={item.productID}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  tabIndex={-1}
                  className={`search-result-item ${
                    index === highlightedIndex ? "highlighted" : ""
                  }`}
                  onMouseDown={() => handleSelectResult(item)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <img
                    src={item.productImageUrl}
                    alt={item.name}
                    className="search-result-thumbnail"
                  />
                  <div className="search-result-details">
                    <span className="search-result-name">{item.name}</span>
                    <span className="search-result-price">
                      S${formatPrice(item.price)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
