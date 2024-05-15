import React from 'react'
// import { BannerAd } from '../layout/Home/HomeBannerAd'
import HomeCarousel from '../layout/Home/HomeCarousel'
import HomeCategoryCard from '../layout/Home/HomeCategoryCard'

const Homepage: React.FC = () => {
  return (
    <div>
      {/* <BannerAd /> */}
      <HomeCarousel />
      <HomeCategoryCard />
    </div>
  )
}

export default Homepage