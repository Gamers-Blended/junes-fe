import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ProductSlider from "../components/ProductSlider";
import ApolloJusticeAceAttorneyTrilogyUSNSW from "../assets/products/apollo-justice-ace-attorney-trilogy-us-nsw.jpg";
import AtelierMarieRemakeASIANSW from "../assets/products/atelier-marie-remake-the-alchemist-of-salburg-asia-nsw.jpg";
import BatenKaitosRemasterASIANSW from "../assets/products/baten-kaitos-i-ii-hd-remaster-asia-nsw.jpg";
import ChronoCrossTrdeASIANSW from "../assets/products/chrono-cross-the-radical-dreamers-edition-asia-nsw.jpg";
import FatalFameMobwASIANSW from "../assets/products/fatal-frame-maiden-of-black-water-asia-nsw.jpg";
import FatalFameMobwASIAPS4 from "../assets/products/fatal-frame-maiden-of-black-water-asia-ps4.jpg";
import FatalFameMotleASIANSW from "../assets/products/fatal-frame-mask-of-the-lunar-eclipse-asia-nsw.jpg";
import FatalFameMotleASIAPS4 from "../assets/products/fatal-frame-mask-of-the-lunar-eclipse-asia-ps4.jpg";
import FinalFantasyPixelRemasterASIANSW from "../assets/products/final-fantasy-ivi-pixel-remaster-collection-asia-nsw.jpg";
import FinalFantasyXIASIANSW from "../assets/products/final-fantasy-ix-asia-nsw.jpg";
import FinalFantasyVIIVIIITwinEURNSW from "../assets/products/final-fantasy-vii-final-fantasy-viii-remastered-twin-pack-eur-nsw.jpg";
import GrandiaASIANSW from "../assets/products/grandia-hd-collection-asia-nsw.jpg";
import AceAttorneyTrilogyJPNSW from "../assets/products/gyakuten-saiban-123-naruhodo-selection-jp-nsw.jpg";
import NinjaGaidenCollectionASIANSW from "../assets/products/ninja-gaiden-master-collection-asia-nsw.jpg";
import NinjaGaidenCollectionASIAPS4 from "../assets/products/ninja-gaiden-master-collection-asia-ps4.jpg";
import SagaFrontierASIANSW from "../assets/products/saga-frontier-remastered-asia-nsw.jpg";

const PromoCarousel = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImageUrls = async () => {
      const fetchedUrls = [
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

function HomePage() {
  // Recommended items to user
  const recommendedItems = [
    {
      title: "Apollo Justice Ace Attorney Trilogy",
      price: "S$40.00",
      imageSrc: ApolloJusticeAceAttorneyTrilogyUSNSW,
    },
    {
      title: "Atelier Marie Remake: The Alchemist of Salburg",
      price: "S$70.00",
      imageSrc: AtelierMarieRemakeASIANSW,
    },
    {
      title: "Baten Kaitos I & II HD Remaster",
      price: "S$60.00",
      imageSrc: BatenKaitosRemasterASIANSW,
    },
    {
      title: "Chrono Cross: The Radical Dreamers Edition",
      price: "S$70.00",
      imageSrc: ChronoCrossTrdeASIANSW,
    },
    {
      title: "Fatal Frame: Mask of the Lunar Eclipse",
      price: "S$70.00",
      imageSrc: FatalFameMotleASIANSW,
    },
    {
      title: "Fatal Frame: Mask of the Lunar Eclipse",
      price: "S$70.00",
      imageSrc: FatalFameMotleASIAPS4,
    },
    {
      title: "Fatal Frame: Maiden of Black Water",
      price: "S$60.00",
      imageSrc: FatalFameMobwASIANSW,
    },
    {
      title: "Fatal Frame: Maiden of Black Water",
      price: "S$60.00",
      imageSrc: FatalFameMobwASIAPS4,
    },
    {
      title: "Final Fantasy Pixel Remaster Collection",
      price: "S$70.00",
      imageSrc: FinalFantasyPixelRemasterASIANSW,
    },
    {
      title: "Final Fantasy XI",
      price: "S$40.00",
      imageSrc: FinalFantasyXIASIANSW,
    },
    {
      title: "Final Fantasy VII Final Fantasy VIII Remastered Twin Pack",
      price: "S$40.00",
      imageSrc: FinalFantasyVIIVIIITwinEURNSW,
    },
    {
      title: "Grandia HD Collection",
      price: "S$50.00",
      imageSrc: GrandiaASIANSW,
    },
    {
      title: "Ace Attorney Trilogy",
      price: "S$40.00",
      imageSrc: AceAttorneyTrilogyJPNSW,
    },
    {
      title: "Ninja Gaiden Master Collection",
      price: "S$40.00",
      imageSrc: NinjaGaidenCollectionASIANSW,
    },
    {
      title: "Ninja Gaiden Master Collection",
      price: "S$40.00",
      imageSrc: NinjaGaidenCollectionASIAPS4,
    },
    {
      title: "Saga Frontier Remastered",
      price: "S$40.00",
      imageSrc: SagaFrontierASIANSW,
    },
  ];

  return (
    <div className="home-page-container">
      <PromoCarousel />
      <ProductSlider items={recommendedItems} />
    </div>
  );
}

export default HomePage;
