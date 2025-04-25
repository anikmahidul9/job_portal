import { useDispatch, useSelector } from "react-redux";
import Job from "./Job"
import Navbar from "./shared/Navbar"
import { useEffect } from "react";
import { fetchAllJobs } from "@/redux/jobSlice";


const Browse = () => {
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
      <div className="max-w-7xl mx-auto my-18">
        <h1 className="text-4xl font-bold">
          <span className="text-[#36A853]">Browse </span> Job Openings
        </h1>
        <div className="grid grid-cols-3 gap-4 mt-6">
          {jobs.map((job) => {
            return <Job key={job.id} job={job} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Browse