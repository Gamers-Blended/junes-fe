import React from 'react';

interface GameItem {
  title: string;
  price: string;
  imageSrc: string;
}

interface ProductSliderProps {
  items: GameItem[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ items }) => {

  return (
    <div className='product-slider-container'>
      <div className='product-slider-header'>
        <h2>Recommended For You</h2>
      </div>
      <div className='product-slider-items-container'>
        <div className='product-slider-items'>
          {items.map((item, index) => (
            <div key={index} className='product-slider-card'>
              <img className='product-slider-image' src={item.imageSrc} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;