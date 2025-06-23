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
      name: "Apollo Justice Ace Attorney Trilogy",
      price: "S$40.00",
      productImageUrl: ApolloJusticeAceAttorneyTrilogyUSNSW,
    },
    {
      id: "2",
      name: "Atelier Marie Remake: The Alchemist of Salburg",
      price: "S$70.00",
      productImageUrl: AtelierMarieRemakeASIANSW,
    },
    {
      id: "3",
      name: "Baten Kaitos I & II HD Remaster",
      price: "S$60.00",
      productImageUrl: BatenKaitosRemasterASIANSW,
    },
    {
      id: "4",
      name: "Chrono Cross: The Radical Dreamers Edition",
      price: "S$70.00",
      productImageUrl: ChronoCrossTrdeASIANSW,
    },
    {
      id: "5",
      name: "Fatal Frame: Mask of the Lunar Eclipse",
      price: "S$70.00",
      productImageUrl: FatalFameMotleASIANSW,
    },
    {
      id: "6",
      name: "Fatal Frame: Mask of the Lunar Eclipse",
      price: "S$70.00",
      productImageUrl: FatalFameMotleASIAPS4,
    },
    {
      id: "7",
      name: "Fatal Frame: Maiden of Black Water",
      price: "S$60.00",
      productImageUrl: FatalFameMobwASIANSW,
    },
    {
      id: "8",
      name: "Fatal Frame: Maiden of Black Water",
      price: "S$60.00",
      productImageUrl: FatalFameMobwASIAPS4,
    },
    {
      id: "9",
      name: "Final Fantasy Pixel Remaster Collection",
      price: "S$70.00",
      productImageUrl: FinalFantasyPixelRemasterASIANSW,
    },
    {
      id: "10",
      name: "Final Fantasy XI",
      price: "S$40.00",
      productImageUrl: FinalFantasyXIASIANSW,
    },
    {
      id: "11",
      name: "Final Fantasy VII Final Fantasy VIII Remastered Twin Pack",
      price: "S$40.00",
      productImageUrl: FinalFantasyVIIVIIITwinEURNSW,
    },
    {
      id: "12",
      name: "Grandia HD Collection",
      price: "S$50.00",
      productImageUrl: GrandiaASIANSW,
    },
    {
      id: "13",
      name: "Ace Attorney Trilogy",
      price: "S$40.00",
      productImageUrl: AceAttorneyTrilogyJPNSW,
    },
    {
      id: "14",
      name: "Ninja Gaiden Master Collection",
      price: "S$40.00",
      productImageUrl: NinjaGaidenCollectionASIANSW,
    },
    {
      id: "15",
      name: "Ninja Gaiden Master Collection",
      price: "S$40.00",
      productImageUrl: NinjaGaidenCollectionASIAPS4,
    },
    {
      id: "16",
      name: "Saga Frontier Remastered",
      price: "S$40.00",
      productImageUrl: SagaFrontierASIANSW,
    },
  ];

  return (
    <div className="home-page-container">
      <PromoCarousel />

      {/* Feed ProductSlider with ProductSliderItem list retrieved from API */}
      <ProductSlider items={recommendedItems} />
    </div>
  );
}

export default HomePage;
