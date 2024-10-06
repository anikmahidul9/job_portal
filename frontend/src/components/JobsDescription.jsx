import FilterCard from "./FilterCard"
import Job from "./Job"
import Navbar from "./shared/Navbar"

const JobsDescription = () => {
    const jobsList = [1, 2, 3, 4, 5]
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          <div className="w-20%">
            <FilterCard />
          </div>
          {jobsList.length <= 0 ? (
            <span>No Job Found</span>
          ) : (
            <div className="flex-1 h-[88bh] overflow-y-auto pb-5">
              <div className="grid grid-cols-3 gap-4">
                {jobsList.map((item, index) => (
                  <div key={index}>
                    <Job job={item} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobsDescription