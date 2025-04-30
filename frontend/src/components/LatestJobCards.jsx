/* eslint-disable react/prop-types */
import { useState } from "react";
import { Badge } from "./ui/badge";
import JobDetails from "./JobDetails";

const LatestJobCards = ({ job }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const truncateDescription = (description) => {
    if (!description) return "No description available";
    const words = description.split(" ");
    return words.length > 20 ? `${words.slice(0, 20).join(" ")}...` : description;
  };
  const handleCardClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <>
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer" onClick={handleCardClick}>
      <div>
        <h1 className="font-medium text-lg">{job.company?.name || "Unknown Company"}</h1>
        <p className="text-sm text-gray-500">{job.location || "Location not specified"}</p>
      </div>
      <div>
        <h1 className="font-bold text-lg my-2">{job.title || "Job Title"}</h1>
        <p className="text-sm text-gray-600">{truncateDescription(job.description) || "No description available"}</p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        {job.position && (
          <Badge className="text-blue-700 font-bold" variant="ghost">
            {job.position}
          </Badge>
        )}
        {job.jobType && (
          <Badge className="text-[#F83002] font-bold" variant="ghost">
            {job.jobType}
          </Badge>
        )}
        {job.salary !== undefined && (
          <Badge className="text-[#7209b7] font-bold" variant="ghost">
            {job.salary} LPA
          </Badge>
        )}
      </div>
    </div>
    {isDialogOpen && (<JobDetails job={job} key={job._id} handleCloseDialog={handleCloseDialog} />)}
    </>
  );
};

export default LatestJobCards;