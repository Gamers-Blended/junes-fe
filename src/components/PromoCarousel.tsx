import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ImageUrl {
  src: string;
  link: string;
}

const PromoCarousel: React.FC = () => {
  const [imageUrls, setImageUrls] = useState<ImageUrl[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImageUrls = async () => {
      const fetchedUrls: ImageUrl[] = [
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
      setImageUrls(fetchedUrls);
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

  const handleImageClick = (link: string) => {
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
                width="1300"
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

export default PromoCarousel;