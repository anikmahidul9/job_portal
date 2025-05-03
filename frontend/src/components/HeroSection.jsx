import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useDispatch } from "react-redux";
import { fetchAllJobs } from "@/redux/jobSlice";

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(fetchAllJobs({ search: searchTerm }));
    }
  };

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
      <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 mt-4">
        <Input 
          type="text" 
          placeholder="Search Job" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" className="bg-[#36A853]">
          Search
        </Button>
      </form>
    </div>
  );
};

export default HeroSection;