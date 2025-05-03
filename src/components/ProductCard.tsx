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

    const handleQuickShop: Function = (title:string) => {
        console.log(`Quick shop for ${title}`);
    }

    const handleAddToCart: Function = (title:string) => {
        console.log(`Add to cart for ${title}`);
    }

    return (
        <div className={`product-card-container ${isLoading ? 'disabled' : ''}`}>
            <div className='product-card-image-container'>
                <img className='product-card-image' src={item.imageSrc} alt={item.title} />
            </div>
            <p className='product-card-title'>{trimmedTitle}</p>
            <p className='product-card-price'>{item.price}</p>

            {/* Buttons that appear on hover */}
            <div className='product-card-buttons'>
                <button className="product-card-button" onClick={handleQuickShop(item.title)}>
                    Quick Shop
                </button>
                <button className="product-card-button add-to-cart-button" onClick={handleAddToCart(item.title)}>
                    Add To Cart
                </button>
            </div>

                
        </div>
    );
};

export default ProductCard;