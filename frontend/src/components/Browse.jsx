import { useDispatch, useSelector } from "react-redux";
import Job from "./Job";
import Navbar from "./shared/Navbar";
import { useEffect, useState } from "react";
import { fetchAllJobs } from "@/redux/jobSlice";

const Browse = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.jobs);
  const loading = useSelector((state) => state.jobs.loading);
  const error = useSelector((state) => state.jobs.error);
  const [showGovtOnly, setShowGovtOnly] = useState(false);

  useEffect(() => {
    dispatch(fetchAllJobs());
  }, [dispatch]);

  // Filter jobs if govt only toggle is on
  const filteredJobs = showGovtOnly
    ? jobs.filter(job => job.jobType?.toLowerCase() === "government")
    : jobs;

  if (loading) return <div className="text-center py-10">Loading jobs...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-18">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">
            <span className="text-[#36A853]">Browse </span> Job Openings
          </h1>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showGovtOnly}
              onChange={() => setShowGovtOnly(!showGovtOnly)}
              className="h-4 w-4 text-[#36A853] focus:ring-[#36A853] border-gray-300 rounded"
            />
            <span className="text-gray-700">Government Jobs Only</span>
          </label>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          {filteredJobs.map((job) => (
            <Job key={job.id} job={job} />
          ))}
          {filteredJobs.length === 0 && (
            <div className="col-span-3 text-center py-10 text-gray-500">
              No {showGovtOnly ? "government" : ""} jobs available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;