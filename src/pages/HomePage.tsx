import PromoCarousel from "../components/PromoCarousel";
import ProductSlider from "../components/ProductSlider";

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
    </div>
  );
}

export default HomePage;