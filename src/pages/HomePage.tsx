import { useState, useEffect } from 'react';
import axios from 'axios';
import PromoCarousel from "../components/PromoCarousel";
import ProductSlider from "../components/ProductSlider";
import { useAuth } from "../components/AuthContext.tsx";


interface ProductSliderItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  productImageUrl: string;
}

function HomePage() {
  const [recommendedItems, setRecommendedItems] = useState<ProductSliderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userID } = useAuth();
  const pageNumber = 0;

  useEffect(() => {
    const api = axios.create({
        baseURL: 'http://localhost:8080/junes/api/v1',
        timeout: 10000,
    });
  
    const fetchData = async () => {
      try {
        setLoading(true);
        console.info("Fetching data for recommended products...")

        const response = await api.get<ProductSliderItem[]>(`/frontpage/recommended?userID=${userID}&pageNumber=${pageNumber}`);
        const urlPrefix = "https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/";

        // Append prefix to each productImageUrl
        const updatedData = response.data.map((item) => ({
          ...item,
          productImageUrl: item.productImageUrl ? `${urlPrefix}${item.productImageUrl}` : "",
        }));

        setRecommendedItems(updatedData);
        console.log("Fetched data: {}", recommendedItems)
        // let response;

        // if (isLoggedIn) {
        //   response = await api.get<ProductSliderItem[]>(`/frontpage/recommended?userID=${userID}&pageNumber=${pageNumber}`);
        // } else {
        //   const requestData = {
        //     pageNumber: pageNumber,
        //     historyCache: ["item1"]
        //   };
        //   response = await api.post<ProductSliderItem[]>(`/frontpage/recommended/no-user`, requestData, {headers: {
        //       'Content-Type': 'application/json'
        //     }});
        // }

      } catch (error) {
        console.error('Error fetching data for recommended products (user logged in): ', error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []); // Runs once component mounts
  
  if (loading) {
    return (
      <div className="home-page-container">
        <PromoCarousel />
        <div>Loading recommended items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page-container">
        <PromoCarousel />
        <div>Error loading recommended items: {error}</div>
      </div>
    );
  }
  

  return (
    <div className="home-page-container">
      <PromoCarousel />

      {/* Feed ProductSlider with ProductSliderItem list retrieved from API */}
      <ProductSlider items={recommendedItems} />
    </div>
  );
}

export default HomePage;