import React, { useState, useEffect } from 'react';
import NotificationPopUp from './NotificationPopUp';

import heartGreenIcon from "../assets/heartGreenIcon.png";
import heartGreenFilledIcon from "../assets/heartGreenFilledIcon.png";

interface ProductCardProps {
    item: {
        id: string;
        title: string;
        price: string;
        imageSrc: string;
    },
    isLoading: boolean;
    isLiked?: boolean; // Optional
 }

const ProductCard: React.FC<ProductCardProps> = ({ item, isLoading, isLiked: initialIsLiked = false }) => {
    const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<string>('');
    const [showQuickShop, setShowQuickShop] = useState<boolean>(false);
    const wordLimit = 40;
    // Title will only show up to wordLimit characters
    const trimmedTitle = item.title.length > wordLimit ? `${item.title.substring(0, wordLimit)}...` : item.title;

    const handleAddToWishList = () => {
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);

        const message = newLikedState ? `${item.title} added to Wish List!` : `${item.title} removed from Wish List!`;
        console.log(`${item.title} ${newLikedState ? 'added to' : 'removed from'} wish list`);

        setNotificationMessage(message);
        setShowNotification(true);
    }

    const handleCloseNotification = () => {
        setShowNotification(false);
    }

    const handleQuickShop = () => {
        setShowQuickShop(true);
        console.log(`Quick shop for ${item.title}`);
    }

    const handleAddToCart = () => {
        const message = `${item.title} added to cart!`;
        console.log(`${item.title} added to cart!`);

        setNotificationMessage(message);
        setShowNotification(true);
    }

    const heartIcon = isLiked ? heartGreenFilledIcon : heartGreenIcon;

    const QuickShopWindow = () => {
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
            <div className="quick-shop-window-container">
                <div className="quick-shop-content">
                    <button className='quick-shop-close-button' onClick={handleClose}>X</button>
                    <h2>{item.title}</h2>
                    <p>{item.price}</p>
                    <button className="product-card-button add-to-cart-button" onClick={handleAddToCart}>Add to Cart</button>
                </div>
            </div>
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
                <img className='product-card-image' src={item.imageSrc} alt={item.title} />
            </div>
            <p className='product-card-title'>{trimmedTitle}</p>
            <p className='product-card-price'>{item.price}</p>

            {/* Buttons that appear on hover */}
            <div className='product-card-buttons'>
                <button className="product-card-button" onClick={handleQuickShop}>
                    Quick Shop
                </button>
                <button className="product-card-button add-to-cart-button" onClick={handleAddToCart}>
                    Add To Cart
                </button>
            </div>

            <NotificationPopUp
            message={notificationMessage}
            isVisible={showNotification}
            onClose={handleCloseNotification}
            duration={3000} // 3 seconds
            />

            { showQuickShop && <QuickShopWindow/> }
            
        </div>
    );
};

export default ProductCard;