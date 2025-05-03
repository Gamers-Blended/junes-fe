import React from "react";

import PromoCarousel from "../components/PromoCarousel";
import ProductSlider from "../components/ProductSlider";
import ApolloJusticeAceAttorneyTrilogyUSNSW from "../assets/products/nsw_us_apollo_justice_ace_attorney_trilogy.jpg";
import AtelierMarieRemakeASIANSW from "../assets/products/nsw_asia_atelier_marie_remake.jpg";
import BatenKaitosRemasterASIANSW from "../assets/products/nsw_asia_baten_kaitos_i_ii_hd_remaster.jpg";
import ChronoCrossTrdeASIANSW from "../assets/products/nsw_asia_chrono_cross_the_radical_dreamers_edition.jpg";
import FatalFameMobwASIANSW from "../assets/products/nsw_asia_fatal_frame_maiden_of_black_water.jpg";
import FatalFameMobwASIAPS4 from "../assets/products/ps4_asia_fatal_frame_maiden_of_black_water.jpg";
import FatalFameMotleASIANSW from "../assets/products/nsw_asia_fatal_frame_mask_of_the_lunar_eclipse.jpg";
import FatalFameMotleASIAPS4 from "../assets/products/ps4_asia_fatal_frame_mask_of_the_lunar_eclipse.jpg";
import FinalFantasyPixelRemasterASIANSW from "../assets/products/nsw_asia_final_fantasy_pixel_remaster_collection.jpg";
import FinalFantasyXIASIANSW from "../assets/products/nsw_asia_final_fantasy_ix.jpg";
import FinalFantasyVIIVIIITwinEURNSW from "../assets/products/nsw_eur_final_fantasy_vii_final_fantasy_viii_remastered_twin_pack.jpg";
import GrandiaASIANSW from "../assets/products/nsw_asia_grandia_hd_collection.jpg";
import AceAttorneyTrilogyJPNSW from "../assets/products/nsw_jp_phoenix_wright_ace_attorney_trilog.jpg";
import NinjaGaidenCollectionASIANSW from "../assets/products/nsw_asia_ninja_gaiden_master_collection.jpg";
import NinjaGaidenCollectionASIAPS4 from "../assets/products/ps4_asia_ninja_gaiden_master_collection.jpg";
import SagaFrontierASIANSW from "../assets/products/nsw_asia_saga_frontier_remastered.jpg";

function HomePage() {
  // Recommended items to user
  const recommendedItems = [
    {
      id: "1",
      title: "Apollo Justice Ace Attorney Trilogy",
      price: "S$40.00",
      imageSrc: ApolloJusticeAceAttorneyTrilogyUSNSW,
    },
    {
      id: "2",
      title: "Atelier Marie Remake: The Alchemist of Salburg",
      price: "S$70.00",
      imageSrc: AtelierMarieRemakeASIANSW,
    },
    {
      id: "3",
      title: "Baten Kaitos I & II HD Remaster",
      price: "S$60.00",
      imageSrc: BatenKaitosRemasterASIANSW,
    },
    {
      id: "4",
      title: "Chrono Cross: The Radical Dreamers Edition",
      price: "S$70.00",
      imageSrc: ChronoCrossTrdeASIANSW,
    },
    {
      id: "5",
      title: "Fatal Frame: Mask of the Lunar Eclipse",
      price: "S$70.00",
      imageSrc: FatalFameMotleASIANSW,
    },
    {
      id: "6",
      title: "Fatal Frame: Mask of the Lunar Eclipse",
      price: "S$70.00",
      imageSrc: FatalFameMotleASIAPS4,
    },
    {
      id: "7",
      title: "Fatal Frame: Maiden of Black Water",
      price: "S$60.00",
      imageSrc: FatalFameMobwASIANSW,
    },
    {
      id: "8",
      title: "Fatal Frame: Maiden of Black Water",
      price: "S$60.00",
      imageSrc: FatalFameMobwASIAPS4,
    },
    {
      id: "9",
      title: "Final Fantasy Pixel Remaster Collection",
      price: "S$70.00",
      imageSrc: FinalFantasyPixelRemasterASIANSW,
    },
    {
      id: "10",
      title: "Final Fantasy XI",
      price: "S$40.00",
      imageSrc: FinalFantasyXIASIANSW,
    },
    {
      id: "11",
      title: "Final Fantasy VII Final Fantasy VIII Remastered Twin Pack",
      price: "S$40.00",
      imageSrc: FinalFantasyVIIVIIITwinEURNSW,
    },
    {
      id: "12",
      title: "Grandia HD Collection",
      price: "S$50.00",
      imageSrc: GrandiaASIANSW,
    },
    {
      id: "13",
      title: "Ace Attorney Trilogy",
      price: "S$40.00",
      imageSrc: AceAttorneyTrilogyJPNSW,
    },
    {
      id: "14",
      title: "Ninja Gaiden Master Collection",
      price: "S$40.00",
      imageSrc: NinjaGaidenCollectionASIANSW,
    },
    {
      id: "15",
      title: "Ninja Gaiden Master Collection",
      price: "S$40.00",
      imageSrc: NinjaGaidenCollectionASIAPS4,
    },
    {
      id: "16",
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
