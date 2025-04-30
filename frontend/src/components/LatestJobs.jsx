import { useDispatch, useSelector } from "react-redux";
import LatestJobCards from "./LatestJobCards";
import { useEffect } from "react";
import { fetchAllJobs } from "@/redux/jobSlice";

const LatestJobs = () => {
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
    <div className="max-w-7xl mx-auto my-20">
      <h1 className="text-4xl font-bold">
        <span className="text-[#6A38C2]">Latest & Top </span> Job Openings
      </h1>
      <div className="grid grid-cols-3 gap-4 my-5">
        {jobs.slice(0, 6).map((job) => (
          <LatestJobCards key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default LatestJobs;