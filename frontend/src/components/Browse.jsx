import Job from "./Job"
import Navbar from "./shared/Navbar"

const randomJobs = [1,2,3,4,5,6,7,8,9]
const Browse = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-18">
        <h1 className="text-4xl font-bold">
          <span className="text-[#36A853]">Browse </span> Job Openings
        </h1>
        <div className="grid grid-cols-3 gap-4 mt-6">
          {randomJobs.map((item, index) => {
            return <Job key={index} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Browse