import CategorySlider from "./CategorySlider"
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
   </>
  )
}

export default Home