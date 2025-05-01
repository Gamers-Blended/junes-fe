import React, { useState } from 'react';

import arrowLeftIcon from "../assets/arrowLeftIcon.png";
import arrowRightIcon from "../assets/arrowRightIcon.png";

interface GameItem {
  title: string;
  price: string;
  imageSrc: string;
}

interface ProductSliderProps {
  items: GameItem[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ items }) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleItemsCount = 5;

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setStartIndex((prevIndex) => Math.min(items.length - visibleItemsCount, prevIndex + 1));
  }

  const visibleItems = items.slice(startIndex, startIndex + visibleItemsCount);
  const showPrevButton = startIndex > 0;
  const showNextButton = startIndex < items.length - visibleItemsCount;

  return (
    <div className='product-slider-container'>
      <div className='product-slider-header'>
        <h2>Recommended For You</h2>
      </div>
      <div className='product-slider-items-container'>
      {showPrevButton && (
          <button className='slider-arrow prev' onClick={handlePrev}>
            <img src={arrowLeftIcon} alt="Previous" />
          </button>
        )}
        <div className='product-slider-items'>
          {visibleItems.map((item, index) => (
            <div key={index} className='product-slider-card'>
              <img className='product-slider-image' src={item.imageSrc} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.price}</p>
            </div>
          ))}
        </div>
        {showNextButton && (
          <button className='slider-arrow next' onClick={handleNext}>
            <img src={arrowRightIcon} alt="Next" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductSlider;