import CategorySlider from "./CategorySlider"
import { CompanyList } from "./company/CompanyCardHome"

import HeroSection from "./HeroSection"
import LatestJobs from "./LatestJobs"
import Navbar from "./shared/Navbar"

const Home = () => {
  return (
   <>
   <Navbar/>
   <HeroSection/>
   <CategorySlider/>
   <LatestJobs/>
   <CompanyList/>
   </>
  )
}

export default Home