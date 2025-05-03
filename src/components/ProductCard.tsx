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

  return (
            <div className={`product-slider-card ${isLoading ? 'disabled' : ''}`}>
              <img className='product-slider-image' src={item.imageSrc} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.price}</p>
            </div>
  );
};

export default ProductCard;