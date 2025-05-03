import React, { useState } from 'react';
import ProductCard from './ProductCard';

import arrowLeftIcon from "../assets/arrowLeftIcon.png";
import arrowRightIcon from "../assets/arrowRightIcon.png";

interface GameItem {
  id: string;
  title: string;
  price: string;
  imageSrc: string;
}

interface ProductSliderProps {
  items: GameItem[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ items }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const visibleItemsCount = 5;

  const handlePrev = () => {
    if (isLoading) return; // Prevent clicking during loading

    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      // Shift index by visibleItemsCount items, set to 0 if negative
      setStartIndex((prevIndex) => Math.max(0, prevIndex - visibleItemsCount));
      setIsLoading(false);
    }, 500); // 500ms loading time
  };

  const handleNext = () => {
    if (isLoading) return; // Prevent clicking during loading

    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      // Shift index by visibleItemsCount items, set to last index if greater than last index
      setStartIndex((prevIndex) => Math.min(items.length - visibleItemsCount, prevIndex + visibleItemsCount));
      setIsLoading(false);
    }, 500); // 500ms loading time
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
        {/* Loading Placeholder */}
        {isLoading && (
          <div className='product-slider-loading-placeholder'>
            <div className='product-slider-loading-spinner'></div>
            <div className='product-slider-loading-text'>Loading items...</div>
          </div>
        )}

        {showPrevButton && (
          <button className={`slider-arrow prev ${isLoading ? 'disabled' : ''}`} onClick={handlePrev} disabled={isLoading}>
            <img src={arrowLeftIcon} alt="Previous" />
          </button>
        )}
        <div className='product-slider-items'>
          {visibleItems.map((item, index) => (
           <ProductCard key={index} item={item} isLoading={isLoading} />
          ))}
        </div>
        
        {showNextButton && (
          <button className={`slider-arrow next ${isLoading ? 'disabled' : ''}`} onClick={handleNext} disabled={isLoading}>
            <img src={arrowRightIcon} alt="Next" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductSlider;