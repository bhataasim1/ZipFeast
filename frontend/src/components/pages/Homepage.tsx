import React from "react";
import { BannerAd } from '../layout/Home/HomeBannerAd'
// import HomeCarousel from "../layout/Home/HomeCarousel";
import Store from "../layout/Home/Store";
// import Category from "../layout/Home/Category";

const Homepage: React.FC = () => {
  return (
    <div>
      <BannerAd />
      {/* <HomeCarousel /> */}
      {/* <Category /> */}
      <Store />
    </div>
  );
};

export default Homepage;
