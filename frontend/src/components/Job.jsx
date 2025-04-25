/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import JobDetails from "./JobDetails";

const Job = ({job}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const getTimeDifference = (createdAt) => {
      const now = new Date();
      const createdDate = new Date(createdAt);
      const diffInMilliseconds = now - createdDate;
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  
      if (diffInDays === 0) {
        return "Today";
      } else if (diffInDays === 1) {
        return "1 Day ago";
      } else {
        return `${diffInDays} Days ago`;
      }
    };
  
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
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{getTimeDifference(job.createdAt)}</p>
        <Button variant="outline" className="rounded-full" size="icon">
          save
        </Button>
      </div>

      <div className="flex items-center gap-2 my-2">
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className="font-medium text-lg">{job.company?.name}</h1>
          <p className="text-sm text-gray-500">{job.location}</p>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-lg my-2">{job.tittle}</h1>
        <p className="text-sm text-gray-600">{truncateDescription(job.description)}</p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Badge className={"text-blue-700 font-bold"} variant="ghost">
          {job.position}
        </Badge>
        <Badge className={"text-[#F83002] font-bold"} variant="ghost">
          {job.jobType}
        </Badge>
        <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
          {job.salary} LPA
        </Badge>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Button variant="outline" onClick={handleCardClick}>Details</Button>
        <Button className="bg-[#36A853]">Save For Later</Button>
      </div>
    </div>
      {isDialogOpen && (
        <JobDetails job={job} handleCloseDialog={handleCloseDialog} />
      )}
    </>
  );
}

export default Job