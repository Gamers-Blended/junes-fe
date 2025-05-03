import React from 'react';

interface ProductCardProps {
    item: {
        title: string;
        price: string;
        imageSrc: string;
    },
    isLoading: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, isLoading }) => {
    const wordLimit = 40;
    // Title will only show up to wordLimit characters
    const trimmedTitle = item.title.length > wordLimit ? `${item.title.substring(0, wordLimit)}...` : item.title;

    return (
            <div className={`product-card-container ${isLoading ? 'disabled' : ''}`}>
                <div className='product-card-image-container'>
                    <img className='product-card-image' src={item.imageSrc} alt={item.title} />
                </div>
                <p className='product-card-title'>{trimmedTitle}</p>
                <p className='product-card-price'>{item.price}</p>
            </div>
    );
};

export default ProductCard;