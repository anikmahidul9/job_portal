/* eslint-disable react/prop-types */

import { applyForJob } from "@/redux/applicationSlice";
import { useDispatch, useSelector } from "react-redux";


const JobDetails = ({job,handleCloseDialog}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.application);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleApply = () => {
    if (!isAuthenticated) {
      console.log("User is not authenticated");
      return;
    }
    console.log("Applying for job:", job._id);
    dispatch(applyForJob(job._id))
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
      <h1 className="text-2xl font-bold mb-4">{job.title || "Job Title"}</h1>
      <p className="text-gray-600 mb-4">
        <strong>Company:</strong> {job.company?.name || "Unknown Company"}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Location:</strong> {job.location || "Location not specified"}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Salary:</strong> {job.salary !== undefined ? `${job.salary} LPA` : "Not specified"}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Job Type:</strong> {job.jobType || "Not specified"}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Position:</strong> {job.position || "Not specified"}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Description:</strong> {job.description || "No description available"}
      </p>
      <div className="flex justify-end gap-4">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
          onClick={handleCloseDialog}
        >
          Close
        </button>
        <div>
      <button 
        onClick={handleApply}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Applying...' : 'Apply Now'}
      </button>
    </div>
      </div>
    </div>
    </div>
  )
}

export default JobDetails;