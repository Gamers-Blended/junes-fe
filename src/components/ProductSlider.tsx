import React from 'react';
import ProductCard from './ProductCard';


interface ProductSliderItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  productImageUrl: string;
}

interface ProductSliderProps {
  items: ProductSliderItem[];
  isLoading: boolean;
}

/**
 * Component that displays visibleItemsCount products with arrows
 * @para items - A list of ProductSliderItem to display
 * @returns ProductSlider component with the given list of ProductSliderItem
 */
const ProductSlider: React.FC<ProductSliderProps> = ({ items, isLoading = false }) => {

  return (
    <div className='product-slider-items'>
      {items.map((item, index) => (
        <ProductCard key={item.id} item={item} isLoading={isLoading} />
      ))}
    </div>
  );
};

export default ProductSlider;