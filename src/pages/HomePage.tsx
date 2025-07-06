import PromoCarousel from "../components/PromoCarousel";
import ProductSlider from "../components/ProductSlider";
import ProductSelector from "../components/ProductSelector";

function HomePage() {
  return (
    <div className="home-page-container">
      <PromoCarousel />

      <ProductSlider
        title="Recommended For You"
      />
      
      <ProductSlider
        title="Preorders"
      />
      
      <ProductSlider
        title="Best Sellers"
      />

      <ProductSelector/>
    </div>
  );
}

export default HomePage;