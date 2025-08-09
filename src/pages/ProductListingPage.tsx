import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ProductSliderItem, PageResponse } from '../types/products';
import { appendUrlPrefix } from '../utils/utils.ts';
import { Platform } from "../utils/Enums";
import { genreOptions, regionOptions, publisherOptions, editionOptions, languageOptions, startingLetterOptions, releaseDateOptions } from '../utils/FilterEnums';
import { formatPrice } from '../utils/utils';
import InputOptionsBox from '../components/InputOptionsBox';
import ProductCard from '../components/ProductCard';

import ps4Banner from "../assets/banners/ps4-banner.jpg";
import ps5Banner from "../assets/banners/ps5-banner.jpg";
import nswBanner from "../assets/banners/nsw-banner.jpg";
import nsw2Banner from "../assets/banners/nsw2-banner.jpg";
import xboxBanner from "../assets/banners/xbox-banner.jpg";
import pcBanner from "../assets/banners/pc-banner.jpg";

interface Game {
    id: string;
    name: string;
    slug: string;
    platform: string;
    region: string;
    edition: string;
    price: string;
    productImageUrl: string;
}

const ProductListingPage: React.FC = () => {
    const navigate = useNavigate();
    const { platform } = useParams<{ platform: string }>();
    const [selectedCategory, setSelectedCategory] = useState('Games')
    const [sortBy, setSortBy] = useState('name');
    const [orderBy, setOrderBy] = useState('asc');
    const [priceFilter, setPriceFilter] = useState({ minPrice: '', maxPrice: ''});
    const [priceError, setPriceError] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(15); // Must correspond with 1st option
    const [currentPage, setCurrentPage] = useState(0);
    const [pageInputValue, setPageInputValue] = useState('1');

    // Product data states
    const [products, setProducts] = useState<ProductSliderItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pageInfo, setPageInfo] = useState<{
        totalElements: number;
        totalPages: number;
        currentPage: number;
    }>({
        totalElements: 0,
        totalPages: 0,
        currentPage: 0
    });

    // States for clearing filters
    const [clearTrigger, setClearTrigger] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [availability, setAvailablity] = useState({
        inStock: false,
        outOfStock: false,
        preOrders: false
    });

    // Store filter selections from InputOptionsBox components
    const [filterSelections, setFilterSelections] = useState({
        genres: [] as string[],
        regions: [] as string[],
        publishers: [] as string[],
        editions: [] as string[],
        languages: [] as string[],
        startingLetter: [] as string[],
        releaseDate: [] as string[]
    });
    
    const categories = ['Games', 'Pre-Orders', 'Best Sellers', 'Consoles'];

    const sortOptions = [
        { value: 'name-asc', label: 'Name (A → Z)', sortBy: 'name', orderBy: 'asc' },
        { value: 'name-desc', label: 'Name (Z → A)', sortBy: 'name', orderBy: 'desc' },
        { value: 'price-asc', label: 'Price ↗', sortBy: 'price', orderBy: 'asc' },
        { value: 'price-desc', label: 'Price ↘', sortBy: 'price', orderBy: 'desc' },
        { value: 'release-asc', label: 'Release Date ↗', sortBy: 'release_date', orderBy: 'asc' },
        { value: 'release-desc', label: 'Release Date ↘', sortBy: 'release_date', orderBy: 'desc' }
    ];

    const topPreOrders: Game[] = [
        { id: '1', name: 'Atelier Marie Remake: The Alchemist of Salburg', slug: 'atelier-marie-remake-the-alchemist-of-salburg', platform: '', region: '', edition: '', price: '49.99', productImageUrl: 'https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_atelier_marie_remake.jpg' },
        { id: '2', name: 'Final Fantasy Pixel Remaster', slug: 'final-fantasy-pixel-remaster', platform: '', region: '', edition: '', price: '79.99', productImageUrl: 'https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_final_fantasy_pixel_remaster_collection.jpg' },
        { id: '3', name: 'Final Fantasy Pixel Remaster', slug: 'final-fantasy-pixel-remaster', platform: '', region: '', edition: '', price: '79.99', productImageUrl: 'https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_final_fantasy_pixel_remaster_collection.jpg' },
        { id: '4', name: 'Final Fantasy Pixel Remaster', slug: 'final-fantasy-pixel-remaster', platform: '', region: '', edition: '', price: '79.99', productImageUrl: 'https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_final_fantasy_pixel_remaster_collection.jpg' },
        { id: '5', name: 'Final Fantasy Pixel Remaster', slug: 'final-fantasy-pixel-remaster', platform: '', region: '', edition: '', price: '79.99', productImageUrl: 'https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_final_fantasy_pixel_remaster_collection.jpg' }
    ];

    // Build query parameters
    const buildQueryParams = useCallback(() => {
        const params: Record<string, any> = {
            page: currentPage,
            size: itemsPerPage,
            sort: `${sortBy},${orderBy}`
        };

        // Add search text if provided
        if (searchText.trim()) {
            params.name = searchText.trim();
        }

        // Add price filters if provided
        if (priceFilter.minPrice !== '') {
            params.minPrice = parseFloat(priceFilter.minPrice);
        }
        if (priceFilter.maxPrice !== '') {
            params.maxPrice = parseFloat(priceFilter.maxPrice);
        }

        // Add availability filters
        const availabilityFilters = [];
        if (availability.inStock) availabilityFilters.push('in_stock');
        if (availability.outOfStock) availabilityFilters.push('out_of_stock');
        if (availability.preOrders) availabilityFilters.push('preorder');
        if (availabilityFilters.length > 0) {
            params.availability = availabilityFilters.join(',');
        }

        // Add filter selections
        Object.entries(filterSelections).forEach(([key, values]) => {
            if (values.length > 0) {
                params[key] = values.join(',');
            }
        });

        return params;
    }, [
        currentPage,
        itemsPerPage,
        sortBy,
        orderBy,
        selectedCategory,
        searchText,
        priceFilter,
        availability,
        filterSelections
    ]);

    // Fetch products from API
    const fetchProducts = useCallback(async () => {
        if (!platform) return;

        setIsLoading(true);
        setError(null);

        try {
            // This code snippet is for testing loading state
            // Create a promise that resolves after 10 seconds
            // const delayPromise = new Promise(resolve => setTimeout(resolve, 10000));
            
            // Make both the API call and wait for the delay
            // const [response] = await Promise.all([
            //     axios.get<PageResponse<ProductSliderItem>>(
            //         `http://localhost:8080/junes/api/v1/product/products/${platform}`,
            //         {
            //             params: buildQueryParams()
            //         }
            //     ),
            //     delayPromise
            // ]);

            const response = await axios.get<PageResponse<ProductSliderItem>>(
                `http://localhost:8080/junes/api/v1/product/products/${platform}`,
                {
                    params: buildQueryParams()
                }
            );
            
            const data = response.data;

            // Append prefix to each productImageUrl
            data.content.forEach(item => {
                item.productImageUrl = appendUrlPrefix(item.productImageUrl);
            });

            setProducts(data.content);
            setPageInfo({
                totalElements: data.totalElements,
                totalPages: data.totalPages,
                currentPage: data.number
            });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch products');
            } else {
                setError('An unexpected error occurred');
            }
            console.error('Error fetching products:', err);
        } finally {
            setIsLoading(false);
        }
    }, [platform, buildQueryParams]);

    // Fetch products when component mounts or dependencies change
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Reset to first page when filters change (except pagination-related changes)
    const resetToFirstPage = useCallback(() => {
        if (currentPage !== 0) {
            setCurrentPage(0);
            setPageInputValue('1');
        }
    }, [currentPage]);

    // Watch for filter changes and reset to first page
    useEffect(() => {
        resetToFirstPage();
    }, [
        selectedCategory,
        searchText,
        priceFilter.minPrice,
        priceFilter.maxPrice,
        availability,
        filterSelections,
        sortBy,
        orderBy,
        itemsPerPage
    ]);

    const handlePreOrderClick = (slug: string) => {
        navigate('/details/' + slug);
    }

    const formatPlatform = () => {
        switch (platform) {
            case Platform.PS4:
                return 'PLAYSTATION 4';
            case Platform.PS5:
                return 'PLAYSTATION 5';
            case Platform.NSW:
                return 'NINTENDO SWITCH';
            case Platform.NSW2:
                return 'NINTENDO SWITCH 2';
            case Platform.XBOX:
                return 'XBOX';
            case Platform.PC:
                return 'PC';
            default:
                return '';
        }
    };

    const getBanner = () => {
        switch (platform) {
            case Platform.PS4:
                return ps4Banner;
            case Platform.PS5:
                return ps5Banner;
            case Platform.NSW:
                return nswBanner;
            case Platform.NSW2:
                return nsw2Banner;
            case Platform.XBOX:
                return xboxBanner;
            case Platform.PC:
                return pcBanner;
            default:
                return '';
        }
    };

    const getCurrentSortValue = (): string => {
        const currentOption = sortOptions.find(
            option => option.sortBy === sortBy && option.orderBy === orderBy
        );
        return currentOption ? currentOption.value : sortOptions[0].value;
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        const selectedOption = sortOptions.find(option => option.value === value);

        if (!selectedOption) {
            // Fallback to 1st option if no match found
            const fallbackOption = sortOptions[0];
            setSortBy(fallbackOption.sortBy);
            setOrderBy(fallbackOption.orderBy);
            return;
        }

        setSortBy(selectedOption.sortBy);
        setOrderBy(selectedOption.orderBy);
    };

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
    };

    const handlePriceFilterChange = (type: 'min' | 'max', value: string) => {
        // Negative value check
        const newValue = value === '' ? '' : Math.max(0, parseFloat(value)).toString();

        if (type === 'min') {
            setPriceFilter(prev => ({ ...prev, minPrice: newValue }));
        } else {
            setPriceFilter(prev => ({ ...prev, maxPrice: newValue }));
        }
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

    const handlePageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;

        // Allow empty string OR strings containing only digits (but can be partial)
        if (inputValue === '' || /^\d+$/.test(inputValue)) {
            setPageInputValue(inputValue);
        }
    };

    const handlePageJump = () => {
        // If empty, reset to current page (don't jump anywhere)
        if (pageInputValue === '' || pageInputValue.trim() === '') {
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

    const handlePageInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handlePageJump();
        }
    };

    const handlePageInputBlur = () => {
        handlePageJump();
    };

    useEffect(() => {
        // min cannot be > max
        if (priceFilter.minPrice !== '' && priceFilter.maxPrice !== '' &&
                parseFloat(priceFilter.minPrice) > parseFloat(priceFilter.maxPrice)) {
            setPriceError('Minimum price cannot be greater than maximum price');
        } else {
            setPriceError('');
        }
    }, [priceFilter.minPrice, priceFilter.maxPrice])

    // Clears all filters
    const handleClearAllFilters = () => {
        setSearchText('');
        setPriceFilter({ minPrice: '', maxPrice:'' });
        setAvailablity({
            inStock: false,
            outOfStock: false,
            preOrders: false
        });

        // Clear all InputOptionsBox selections by incrementing trigger
        setClearTrigger(prev => prev + 1);

        setFilterSelections({
            genres: [],
            regions: [],
            publishers: [],
            editions: [],
            languages: [],
            startingLetter: [],
            releaseDate: []
        });
    };

    // Update filter selections
    const updateFilterSelection = useCallback((filterType: keyof typeof filterSelections) => 
        (selectedOptions: string[]) => {
            setFilterSelections(prev => ({
                ...prev,
                [filterType]: selectedOptions
            }));
        }, []);
    
    const hasActiveFilters = () => {
        return searchText !== '' ||
                priceFilter.minPrice !== '' ||
                priceFilter.maxPrice !== '' ||
                availability.inStock ||
                availability.outOfStock || 
                availability.preOrders ||
                Object.values(filterSelections).some(selections => selections.length > 0);
    };

    const getItemRange = () => {
        const start = currentPage * itemsPerPage + 1;
        const end = Math.min(start + products.length - 1, pageInfo.totalElements);
        return { start, end };
    };

    return (
        <div className='product-listing-container'>

            <div className='product-listing-header'>
                {formatPlatform()}
            </div>

            <div className='product-listing-main'>
                <div className='product-listing-sidebar'>

                    <div className='product-listing-categories-section'>

                        <div className='product-listing-section-header'>
                            Categories
                        </div>
                        <ul className='category-list'>
                            {categories.map((category) => (
                                <li 
                                    key={category} 
                                    className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>

                    </div>

                    <div className='product-listing-preorders-section'>

                        <div className='product-listing-preorders-section-header'>
                            Top Pre-Orders of the Week
                        </div>
                        {topPreOrders.map((game, index) => (
                            <div key={game.id} className='preorder-item' onClick={() => handlePreOrderClick(game.slug)}>
                                <div className="preorder-counter">{index + 1}.</div>
                                <div className='preorder-image'>
                                    <img className='product-card-image' src={game.productImageUrl} alt={game.name} />
                                </div>
                                
                                <div className='preorder-info'>
                                    <div className='preorder-title'>{game.name}</div>
                                    <div className='preorder-price'>{formatPrice(game.price)}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <div className='product-listing-content-container'>
                    <div className='platform-banner'>
                        <img className='banner-image' src={getBanner()} alt={platform} />
                    </div>

                    <div className='product-listing-content'>

                        {/* Loading Placeholder */}
                        {isLoading && (
                            <div className='product-listing-loading-placeholder'>
                                <div className='product-slider-loading-spinner'></div>
                                <div className='product-slider-loading-text'>Loading items...</div>
                            </div>
                        )}
                    
                        {/* <!-- Sidebar Filters --> */}
                        <div className='filters-sidebar'>
                            <h3>FILTERS</h3>

                                <button
                                    onClick={handleClearAllFilters}
                                    className='clear-all-filters-btn'
                                    disabled={!hasActiveFilters()}
                                >
                                    Clear All
                                </button>
                                       

                            <div className='filters-section'>
                                <input 
                                    type='text' 
                                    className='search-input common-input-box' 
                                    placeholder='Type to search title'
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>

                            <div className='filters-section'>
                                <h4>Availability</h4>
                                <div className='checkbox-group'>
                                    <div className='checkbox-item'>
                                        <input
                                            type='checkbox' 
                                            id='in-stock'
                                            checked={availability.inStock}
                                            onChange={(e) => setAvailablity(prev => ({ ...prev, inStock: e.target.checked }))}    
                                        />
                                        <label className='filter-label'>In Stock</label>
                                    </div>

                                    <div className='checkbox-item'>
                                        <input 
                                            type='checkbox' 
                                            id='out-stock'
                                            checked={availability.outOfStock}
                                            onChange={(e) => setAvailablity(prev => ({ ...prev, outOfStock: e.target.checked }))}
                                        />
                                        <label className='filter-label'>Out of Stock</label>
                                    </div>

                                    <div className='checkbox-item'>
                                        <input 
                                            type='checkbox' 
                                            id='pre-orders'
                                            checked={availability.preOrders}
                                            onChange={(e) => setAvailablity(prev => ({ ...prev, preOrders: e.target.checked }))}
                                        />
                                        <label className='filter-label'>Pre-Orders</label>
                                    </div>
                                </div>
                            </div>

                            <div className='filters-section'>
                                <h4>Price Range</h4>
                                <div className='price-inputs'>
                                    <label className='filter-label price-label'>From</label>
                                    <input 
                                        type='number' 
                                        className='price-input common-input-box'
                                        value={priceFilter.minPrice}
                                        onChange={(e) => handlePriceFilterChange('min', e.target.value)}
                                    />
                                </div>
                                <div className='price-inputs'>
                                    <label className='filter-label price-label'>To</label>
                                    <input 
                                        type='number'
                                        className='price-input common-input-box'
                                        value={priceFilter.maxPrice}
                                        onChange={(e) => handlePriceFilterChange('max', e.target.value)}
                                    />
                                </div>
                                {priceError && (
                                    <div className="price-error-message">{priceError}</div>
                                )}
                            </div>

                            <div className='filters-section'>
                                <h4>Genre</h4>
                                <InputOptionsBox
                                    availableOptions={genreOptions.display}
                                    placeholder='Select genres...'
                                    clearTrigger={clearTrigger}
                                    onSelectionChange={(selectedDisplayValues: string[]) => {
                                        // Convert display values to API values
                                        const apiValues = genreOptions.convertToValues(selectedDisplayValues);
                                        updateFilterSelection('genres')(apiValues);
                                    }}
                                />
                            </div>

                            <div className='filters-section'>
                                <h4>Region</h4>
                                <InputOptionsBox
                                    availableOptions={regionOptions.display}
                                    placeholder='Select regions...'
                                    clearTrigger={clearTrigger}
                                    onSelectionChange={(selectedDisplayValues: string[]) => {
                                        const apiValues = regionOptions.convertToValues(selectedDisplayValues);
                                        updateFilterSelection('regions')(apiValues);
                                    }}
                                />
                            </div>

                            <div className='filters-section'>
                                <h4>Publisher</h4>
                                <InputOptionsBox
                                    availableOptions={publisherOptions.display}
                                    placeholder='Select publishers...'
                                    clearTrigger={clearTrigger}
                                    onSelectionChange={(selectedDisplayValues: string[]) => {
                                        const apiValues = publisherOptions.convertToValues(selectedDisplayValues);
                                        updateFilterSelection('publishers')(apiValues);
                                    }}
                                />
                            </div>

                            <div className='filters-section'>
                                <h4>Edition</h4>
                                <InputOptionsBox
                                    availableOptions={editionOptions.display}
                                    placeholder='Select editions...'
                                    clearTrigger={clearTrigger}
                                    onSelectionChange={(selectedDisplayValues: string[]) => {
                                        const apiValues = editionOptions.convertToValues(selectedDisplayValues);
                                        updateFilterSelection('editions')(apiValues);
                                    }}
                                />
                            </div>

                            <div className='filters-section'>
                                <h4>Language</h4>
                                <InputOptionsBox
                                    availableOptions={languageOptions.display}
                                    placeholder='Select languages...'
                                    clearTrigger={clearTrigger}
                                    onSelectionChange={(selectedDisplayValues: string[]) => {
                                        const apiValues = languageOptions.convertToValues(selectedDisplayValues);
                                        updateFilterSelection('languages')(apiValues);
                                    }}
                                />
                            </div>

                            <div className='filters-section'>
                                <h4>A - Z</h4>
                                <InputOptionsBox
                                    availableOptions={startingLetterOptions.display}
                                    placeholder='Select starting letters...'
                                    clearTrigger={clearTrigger}
                                    onSelectionChange={(selectedDisplayValues: string[]) => {
                                        const apiValues = startingLetterOptions.convertToValues(selectedDisplayValues);
                                        updateFilterSelection('startingLetter')(apiValues);
                                    }}
                                />
                            </div>

                            <div className='filters-section'>
                                <h4>Release Date</h4>
                                <InputOptionsBox 
                                    availableOptions={releaseDateOptions.display}
                                    placeholder="Select date..."
                                    isHierachical={true}
                                    clearTrigger={clearTrigger}
                                    onSelectionChange={(selectedDisplayValues: string[]) => {
                                        console.log('Selected display values:', selectedDisplayValues);
                                        const apiValues = releaseDateOptions.convertToValues(selectedDisplayValues);
                                        console.log('Converted API values:', apiValues);
                                        updateFilterSelection('releaseDate')(apiValues);
                                    }}
                                />
                            </div>

                        </div>

                        {/* Main Content */}
                        <div className='main-content'>

                            {/* Content Controls */}
                            <div className='content-controls-row'>
                            
                                <div className='content-controls-group'>
                                    <label className='filter-label'>Sort By</label>
                                    <select
                                        className='filter-select'
                                        value={getCurrentSortValue()}
                                        onChange={handleSortChange}
                                    >
                                        {sortOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='content-controls-group'>
                                    <label className='filter-label'>Items Per Page</label>
                                    <select 
                                        className='filter-select'
                                        value={itemsPerPage}
                                        onChange={handleItemsPerPageChange}>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>

                            </div>
                            
                            {/* Error Message */}
                            {error && (
                                <div className="error-section">
                                    <div className='error-message'>
                                        Error retrieving products: 
                                        <div>
                                            {error}
                                        </div>
                                        <button 
                                            className="retry-button"
                                            onClick={fetchProducts}
                                        >
                                            Retry
                                        </button>
                                    </div>                              
                                </div>
                            )}

                            {!isLoading && !error && (
                                <>
                                    {/* Products Grid */}
                                    <div className="product-grid">
                                        {products.map((product) => (
                                            <ProductCard key={product.id} item={product} isLoading={isLoading} />
                                        ))}
                                    </div>

                                    {products.length === 0 ? (
                                        <>
                                            {/* No Products Found Message */}
                                            <div className='no-products-message'>
                                                No products found for the selected filters
                                            </div>
                                        </>
                                        
                                    ) : (
                                        <>
                                            {/* Product Count Info with Pagination */}
                                            <div className='products-info'>
                                                <div className='products-count'>
                                                    Showing {getItemRange().start} - {getItemRange().end} of {pageInfo.totalElements} Items
                                                </div>

                                                <div className='pagination-controls'>
                                                    
                                                    {currentPage > 0 && (
                                                        <button 
                                                            className='pagination-btn'
                                                            onClick={handlePreviousPage}
                                                        >
                                                            ⮜ Previous
                                                        </button>
                                                    )}

                                                    < div className='page-info'>
                                                        Page{' '}
                                                        <input
                                                            type='number'
                                                            min={1}
                                                            max={pageInfo.totalPages}
                                                            value={pageInputValue}
                                                            onChange={handlePageInputChange}
                                                            onKeyDown={handlePageInputKeyDown}
                                                            onBlur={handlePageInputBlur}
                                                            className='common-input-box'/>
                                                            {' '}
                                                            / {pageInfo.totalPages}
                                                    </div>

                                                    {currentPage < pageInfo.totalPages - 1 && (
                                                        <button 
                                                            className='pagination-btn'
                                                            onClick={handleNextPage}
                                                        >
                                                            Next ➤
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ProductListingPage;