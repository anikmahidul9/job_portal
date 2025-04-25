import { useDispatch, useSelector } from "react-redux";
import FilterCard from "./FilterCard"
import Job from "./Job"
import Navbar from "./shared/Navbar"
import { useEffect } from "react";
import { fetchAllJobs } from "@/redux/jobSlice";

const JobsDescription = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.jobs); // Access jobs from the Redux store
  const loading = useSelector((state) => state.jobs.loading); // Access loading state
  const error = useSelector((state) => state.jobs.error); // Access error state

  useEffect(() => {
    dispatch(fetchAllJobs()); // Fetch jobs on component mount
  }, [dispatch]);

  if (loading) return <div className="text-center py-10">Loading jobs...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

 
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          <div className="w-20%">
            <FilterCard />
          </div>
          {jobs.length <= 0 ? (
            <span>No Job Found</span>
          ) : (
            <div className="flex-1 h-[88bh] overflow-y-auto pb-5">
              <div className="grid grid-cols-3 gap-4">
                {jobs.map((job) => (
                  <div key={job.id}>
                    <Job job={job} />
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