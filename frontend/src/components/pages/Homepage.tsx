import React from "react";
// import { BannerAd } from '../layout/Home/HomeBannerAd'
import HomeCarousel from "../layout/Home/HomeCarousel";
import Store from "../layout/Home/Store";

const Homepage: React.FC = () => {
  return (
    <div>
      {/* <BannerAd /> */}
      <HomeCarousel />
      <Store />
    </div>
  );
};

export default Homepage;
