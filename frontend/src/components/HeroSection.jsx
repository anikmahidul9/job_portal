import { Button } from "./ui/button";
import { Input } from "./ui/input";

const HeroSection = () => {
  return (
    <div className="text-center flex flex-col items-center mt-8">
      <h1 className="text-5xl font-bold mb-4">
        Search, Apply &<br />
        Get your <span className="text-[#36A853]">Dream Jobs</span>
      </h1>
      <p>
        Looking for a new job can be both exciting and daunting. Navigating the
        <br />
        job market involves exploring various avenues, including online job
        boards.
      </p>
      <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
        <Input type="text" placeholder="Search Job" />
        <Button type="submit" className="bg-[#36A853]">
          Search
        </Button>
      </div>
    </div>
  );
}

export default HeroSection