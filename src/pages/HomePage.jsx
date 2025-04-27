import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loginIcon from "../assets/loginIcon.png";
import shoppingCartIcon from "../assets/shoppingCartIcon.png";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PromoCarousel = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImageUrls = async () => {
      const publicUrls = [
        {
          src: "https://pub-8ed9659ed0df4340b16dabcac054d6ac.r2.dev/a_015003.jpg",
          link: "/products/1",
        },
        {
          src: "https://pub-8ed9659ed0df4340b16dabcac054d6ac.r2.dev/a_043578.jpg",
          link: "/products/2",
        },
        {
          src: "https://pub-8ed9659ed0df4340b16dabcac054d6ac.r2.dev/a_265871.jpg",
          link: "/products/3",
        },
        {
          src: "https://pub-8ed9659ed0df4340b16dabcac054d6ac.r2.dev/a_979945.jpg",
          link: "/products/4",
        },
      ];
      setImageUrls(publicUrls);
    };

    fetchImageUrls();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
  };

  const handleImageClick = (link) => {
    navigate(link);
  };

  if (imageUrls.length > 0) {
    return (
      <div className="promo-carousel">
        <Slider {...settings}>
          {imageUrls.map((image, index) => (
            <div
              key={index}
              className="promo-carousel-slide"
              onClick={() => handleImageClick(image.link)}
            >
              <img
                src={image.src}
                alt={`Product Image ${index + 1}`}
                width="1200"
                height="500"
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  }

  // If imageUrls is empty, show a loading message
  return <p>Loading images...</p>;
};

function HomePage() {
  return (
    <div>
      {/* Navigation Bar */}
      <div className="navbar">
        <div className="logo">Junes</div>
        <div className="nav-search-bar-container">
          <input
            type="text"
            placeholder="Search..."
            className="nav-search-bar"
          />
        </div>

        <div className="nav-options-container">
          <img src={loginIcon} alt="Log In" className="nav-options-icon" />
          <img src={shoppingCartIcon} alt="Cart" className="nav-options-icon" />
          <span className="nav-options-span">EN | SGD</span>
        </div>
      </div>

      <div>
        <PromoCarousel />
      </div>
    </div>
  );
}
export default HomePage;
