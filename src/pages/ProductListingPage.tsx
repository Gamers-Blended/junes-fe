import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Platform } from "../utils/Enums";
import { formatPrice } from '../utils/utils';
import InputOptionsBox from '../components/InputOptionsBox';

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

interface ProductSliderItemDTO {
    id: string;
    name: string;
    slug: string;
    platform: string;
    region: string;
    edition: string;
    price: number;
    productImageUrl: string;
}

interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

const ProductListingPage: React.FC = () => {
    const navigate = useNavigate();
    const { platform } = useParams<{ platform: string }>();
    const [selectedCategory, setSelectedCategory] = useState('Games')
    const [sortBy, setSortBy] = useState('name');
    const [orderBy, setOrderBy] = useState('asc');
    const [priceFilter, setPriceFilter] = useState({ min: '', max: ''});
    const [priceError, setPriceError] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [currentPage, setCurrentPage] = useState(0);

    // Product data states
    const [products, setProducts] = useState<ProductSliderItemDTO[]>([]);
    const [loading, setLoading] = useState(false);
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
        genre: [] as string[],
        region: [] as string[],
        publisher: [] as string[],
        edition: [] as string[],
        language: [] as string[],
        alphabet: [] as string[],
        releaseDate: [] as string[]
    });
    
    const categories = ['Games', 'Pre-Orders', 'Best Sellers', 'Consoles'];

    const sortOptions = [
        { value: 'name-asc', label: 'Name (A → Z)', sortBy: 'name', orderBy: 'asc' },
        { value: 'name-desc', label: 'Name (Z → A)', sortBy: 'name', orderBy: 'desc' },
        { value: 'price-asc', label: 'Price ↗', sortBy: 'price', orderBy: 'asc' },
        { value: 'price-desc', label: 'Price ↘', sortBy: 'price', orderBy: 'desc' },
        { value: 'release-asc', label: 'Release Date ↗', sortBy: 'release', orderBy: 'asc' },
        { value: 'release-desc', label: 'Release Date ↘', sortBy: 'release', orderBy: 'desc' }
    ];

    const topPreOrders: Game[] = [
        { id: '1', name: 'Atelier Marie Remake: The Alchemist of Salburg', slug: 'atelier-marie-remake-the-alchemist-of-salburg', platform: '', region: '', edition: '', price: '49.99', productImageUrl: 'https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_atelier_marie_remake.jpg' },
        { id: '2', name: 'Final Fantasy Pixel Remaster', slug: 'final-fantasy-pixel-remaster', platform: '', region: '', edition: '', price: '79.99', productImageUrl: 'https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_final_fantasy_pixel_remaster_collection.jpg' },
        { id: '3', name: 'Final Fantasy Pixel Remaster', slug: 'final-fantasy-pixel-remaster', platform: '', region: '', edition: '', price: '79.99', productImageUrl: 'https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_final_fantasy_pixel_remaster_collection.jpg' },
        { id: '4', name: 'Final Fantasy Pixel Remaster', slug: 'final-fantasy-pixel-remaster', platform: '', region: '', edition: '', price: '79.99', productImageUrl: 'https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_final_fantasy_pixel_remaster_collection.jpg' },
        { id: '5', name: 'Final Fantasy Pixel Remaster', slug: 'final-fantasy-pixel-remaster', platform: '', region: '', edition: '', price: '79.99', productImageUrl: 'https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_final_fantasy_pixel_remaster_collection.jpg' }
    ];

    // Fetch products from API
    const fetchProducts = useCallback(async () => {
        if (!platform) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get<PageResponse<ProductSliderItemDTO>>(
                `http://localhost:8080/junes/api/v1/product/products/${platform}`,
                {
                    params: {
                        page: currentPage,
                        size: itemsPerPage,
                        sort: `${sortBy},${orderBy}`
                    }
                }
            );
            
            const data = response.data;
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
            setLoading(false);
        }
    }, [platform, currentPage, itemsPerPage, sortBy, orderBy]);

    // Fetch products when component mounts or dependencies change
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

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
        setCurrentPage(0); // Reset to first page when sorting changes
    };

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(0); // Reset to first page when page size changes
    };

    const handlePriceFilterChange = (type: 'min' | 'max', value: string) => {
        // Negative value check
        const newValue = value === '' ? '' : Math.max(0, parseFloat(value)).toString();

        if (type === 'min') {
            setPriceFilter(prev => ({ ...prev, min: newValue }));
        } else {
            setPriceFilter(prev => ({ ...prev, max: newValue }));
        }
    };


    useEffect(() => {
        // min cannot be > max
        if (priceFilter.min !== '' && priceFilter.max !== '' &&
                parseFloat(priceFilter.min) > parseFloat(priceFilter.max)) {
            setPriceError('Minimum price cannot be greater than maximum price');
        } else {
            setPriceError('');
        }
    }, [priceFilter.min, priceFilter.max])

    // Clears all filters
    const handleClearAllFilters = () => {
        setSearchText('');
        setPriceFilter({ min: '', max:'' });
        setAvailablity({
            inStock: false,
            outOfStock: false,
            preOrders: false
        });

        // Clear all InputOptionsBox selections by incrementing trigger
        setClearTrigger(prev => prev + 1);

        setFilterSelections({
            genre: [],
            region: [],
            publisher: [],
            edition: [],
            language: [],
            alphabet: [],
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
        return searchText != '' ||
                priceFilter.min != '' ||
                priceFilter.max != '' ||
                availability.inStock ||
                availability.outOfStock || 
                availability.preOrders ||
                Object.values(filterSelections).some(selections => selections.length > 0);
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
                                        value={priceFilter.min}
                                        onChange={(e) => handlePriceFilterChange('min', e.target.value)}
                                    />
                                </div>
                                <div className='price-inputs'>
                                    <label className='filter-label price-label'>To</label>
                                    <input 
                                        type='number'
                                        className='price-input common-input-box'
                                        value={priceFilter.max}
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
                                    availableOptions={['JRPG', 'RPG', 'FPS', 'TPS', 'Racing', 'Action', 'Adventure']}
                                    placeholder='Select genres...'
                                    clearTrigger={clearTrigger}
                                    onSelectionChange={updateFilterSelection('genre')}
                                />
                            </div>

                            <div className='filters-section'>
                                <h4>Region</h4>
                                <InputOptionsBox
                                    availableOptions={['Asia', 'United States', 'Europe', 'Japan']}
                                    placeholder='Select regions...'
                                    clearTrigger={clearTrigger}
                                    onSelectionChange={updateFilterSelection('region')}
                                />
                            </div>

                            <div className='filters-section'>
                                <h4>Publisher</h4>
                                <InputOptionsBox
                                    availableOptions={['Koei', 'Square Enix', 'Capcom']}
                                    placeholder='Select publishers...'
                                    clearTrigger={clearTrigger}
                                    onSelectionChange={updateFilterSelection('publisher')}
                                />
                            </div>

                            <div className='filters-section'>
                                <h4>Edition</h4>
                                <InputOptionsBox
                                    availableOptions={['Standard', 'Collector\'s', 'Limited']}
                                    placeholder='Select editions...'
                                    clearTrigger={clearTrigger}
                                    onSelectionChange={updateFilterSelection('edition')}
                                />
                            </div>

                            <div className='filters-section'>
                                <h4>Language</h4>
                                <InputOptionsBox
                                    availableOptions={['English', 'Chinese', 'Japanese']}
                                    placeholder='Select languages...'
                                    clearTrigger={clearTrigger}
                                    onSelectionChange={updateFilterSelection('language')}
                                />
                            </div>

                            <div className='filters-section'>
                                <h4>A - Z</h4>
                                <InputOptionsBox
                                    availableOptions={['A', 'B', 'C', 'D']}
                                    placeholder='Select starting letters...'
                                    clearTrigger={clearTrigger}
                                    onSelectionChange={updateFilterSelection('alphabet')}
                                />
                            </div>

                            <div className='filters-section'>
                                <h4>Release Date</h4>
                                <InputOptionsBox 
                                    availableOptions={{
                                        '2024': ['January', 'February', 'March', 'April', 'May', 'June'],
                                        '2025': ['January', 'February', 'March', 'April', 'May', 'June']
                                    }}
                                    placeholder="Select date..."
                                    isHierachical={true}
                                    clearTrigger={clearTrigger}
                                    onSelectionChange={updateFilterSelection('releaseDate')}
                                />
                            </div>

                        </div>

                        {/* Main Content */}
                        <div className='main-content'>

                            {/* Header */}
                            <div className='filter-group'>
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

                            <div className='filter-group'>
                                <label className='filter-label'>Items Per Page</label>
                                <select className='filter-select'>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="50">50</option>
                                </select>
                            </div>

                            {/* Loading, Error, and Products Display */}
                            {loading && (
                                <div className="loading-message">Loading products...</div>
                            )}
                            
                            {error && (
                                <div className="error-message">Error: {error}</div>
                            )}

                            {!loading && !error && (
                                <>
                                    {/* Product Count Info */}
                                    <div className="products-info">
                                        Showing {products.length} of {pageInfo.totalElements} products
                                    </div>

                                    {/* Games Grid */}
                                    <div className="games-grid">
                                        {products.map((product) => (
                                            <div 
                                                key={product.id} 
                                                className="product-card"
                                            >
                                                <div className="product-info">
                                                    <h3 className="product-title">{product.name}</h3>
                                                    <p className="product-details">
                                                        {product.platform} • {product.region} • {product.edition}
                                                    </p>
                                                    <div className="product-price">
                                                        {formatPrice(product.price.toString())}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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