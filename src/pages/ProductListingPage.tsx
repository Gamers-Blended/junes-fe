import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Platform } from "../utils/Enums";
import { formatPrice } from '../utils/utils';

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
    const [priceFilter, setPriceFilter] = useState({ min: '', max: ''});

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
        return sortBy;
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortValue = event.target.value;
        setSortBy(newSortValue);
    }

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

                <div className='product-listing-content'>
                    <div className='platform-banner'>
                        <img className='banner-image' src={getBanner()} alt={platform} />
                    </div>

                    <div className='filters-section'>
                        <div className='filters-row'>
                            <div className='filter-group'>
                                <label className='filter-label'>Sort by</label>
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
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductListingPage;