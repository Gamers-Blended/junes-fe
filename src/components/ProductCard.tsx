import React, { useState, useEffect, use } from 'react';
import { useNavigate } from "react-router-dom";
import NotificationPopUp from './NotificationPopUp';
import QuickShopWindow from './QuickShopWindow';
import { useAppDispatch } from '../store/hooks';
import { setSelectedItem } from '../store/productSlice';

import heartGreenIcon from "../assets/heartGreenIcon.png";
import heartGreenFilledIcon from "../assets/heartGreenFilledIcon.png";

interface ProductCardProps {
    item: {
        id: string;
        name: string;
        slug: string;
        platform: string;
        region: string;
        edition: string;
        price: number;
        productImageUrl: string;
    },
    isLoading: boolean;
    isLiked?: boolean; // Optional
 }

const ProductCard: React.FC<ProductCardProps> = ({ item, isLoading, isLiked: initialIsLiked = false }) => {
    const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<string>('');
    const [showQuickShop, setShowQuickShop] = useState<boolean>(false);
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
    const wordLimit = 40;
    // Title will only show up to wordLimit characters
    const trimmedTitle = item.name.length > wordLimit ? `${item.name.substring(0, wordLimit)}...` : item.name;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleNavigateToProduct = () => {
        const url = `/games/${item.slug}`;
        dispatch(setSelectedItem(item)); // Set the selected item in the Redux store
        console.log(`Navigating to product details for ${item.name}`);
        // Navigate to the product details page
        navigate(url);
    };

    const handleAddToWishList = () => {
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);

        const message = newLikedState ? `${item.name} added to Wish List!` : `${item.name} removed from Wish List!`;
        console.log(`${item.name} ${newLikedState ? 'added to' : 'removed from'} wish list`);

        setNotificationMessage(message);
        setShowNotification(true);
    }

    const handleCloseNotification = () => {
        setShowNotification(false);
    }

    const handleQuickShop = () => {
        setShowQuickShop(true);
        console.log(`Quick shop for ${item.name}`);
    }

    const handleAddToCart = (productItem: ProductCardProps['item'], quantity: number = 1) => {
        setIsAddingToCart(true);

        const message = `${productItem.name} added to cart!`;
        console.log(`${productItem.name} added to cart! Quantity: ${quantity}`);

        setNotificationMessage(message);
        setShowNotification(true);
        setIsAddingToCart(false);
    }

    const heartIcon = isLiked ? heartGreenFilledIcon : heartGreenIcon;

    const QuickShopModal = () => {
        const handleClose = () => {
            setShowQuickShop(false);
        };

        // Lock body scroll when modal is open
        useEffect(() => {
            // Add class to prevent scrolling
            document.body.classList.add('modal-open');

            // Clean up function to remove class when component unmounts
            return () => {
                document.body.classList.remove('modal-open');
            };   
        }, []);

        return (
            <QuickShopWindow item={item} onClose={handleClose} onAddToCart={handleAddToCart}/>
        )
    }

    return (
        <div className={`product-card-container ${isLoading ? 'disabled' : ''}`}>
            <div className='product-card-image-container'>
                <img
                    src={heartIcon}
                    className="product-card-icon"
                    onClick={handleAddToWishList}
                    alt={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                />
                <img 
                    src={item.productImageUrl} 
                    className='product-card-image'
                    onClick={handleNavigateToProduct}
                    alt={item.name} 
                />
            </div>
            <p 
                className='product-card-title'
                onClick={handleNavigateToProduct}
            >
                {trimmedTitle}
            </p>
            <p className='product-card-price'>{item.price}</p>

            {/* Buttons that appear on hover */}
            <div className='product-card-buttons'>
                <button className="product-card-button" onClick={handleQuickShop}>
                    Quick Shop
                </button>
                <button className={`product-card-button add-to-cart-button ${isAddingToCart ? 'adding-to-cart' : ''}`} onClick={() => handleAddToCart(item)} disabled={isAddingToCart}>
                    {isAddingToCart ? (
                        <div className='add-to-cart-spinner-container'>
                            <div className='add-to-cart-spinner'></div>
                        </div>
                    ) : 'Add To Cart'}
                </button>
            </div>

            <NotificationPopUp
            message={notificationMessage}
            isVisible={showNotification}
            onClose={handleCloseNotification}
            duration={3000} // 3 seconds
            />

            { showQuickShop && <QuickShopModal/> }
            
        </div>
    );
};

export default ProductCard;