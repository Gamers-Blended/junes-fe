import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { Platform } from "../utils/Enums";
import { formatPrice } from '../utils/utils';

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
    const { platform } = useParams<{ platform: string }>();
    const [selectedCategory, setSelectedCategory] = useState('Games')
    const [sortBy, setSortBy] = useState('name');
    const [priceFilter, setPriceFilter] = useState({ min: '', max: ''});

    const categories = ['Games', 'Pre-Orders', 'Best Sellers', 'Consoles'];

    const topPreOrders: Game[] = [
        { id: '1', name: 'Atelier Marie Remake: The Alchemist of Salburg', slug: '', platform: '', region: '', edition: '', price: '49.99', productImageUrl: 'https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_atelier_marie_remake.jpg' },
        { id: '2', name: 'Final Fantasy Pixel Remaster', slug: '', platform: '', region: '', edition: '', price: '79.99', productImageUrl: 'https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_final_fantasy_pixel_remaster_collection.jpg' },
        { id: '3', name: 'Final Fantasy Pixel Remaster', slug: '', platform: '', region: '', edition: '', price: '79.99', productImageUrl: 'https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_final_fantasy_pixel_remaster_collection.jpg' },
        { id: '4', name: 'Final Fantasy Pixel Remaster', slug: '', platform: '', region: '', edition: '', price: '79.99', productImageUrl: 'https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_final_fantasy_pixel_remaster_collection.jpg' },
        { id: '5', name: 'Final Fantasy Pixel Remaster', slug: '', platform: '', region: '', edition: '', price: '79.99', productImageUrl: 'https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/nsw_asia_std_final_fantasy_pixel_remaster_collection.jpg' }

    ];

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
                            <div key={game.id} className='preorder-item'>
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

            </div>
        </div>
    );
};

export default ProductListingPage;