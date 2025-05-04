import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function AppliedJobTable() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
  
        // const response = await fetch('http://localhost:8000/api/v1/application/user-application', {
          const response = await fetch('https://job-portal-kc3x.onrender.com/api/v1/application/user-application', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        // Check for HTTP errors
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('API Response:', data); // Debug log
  
        // Validate response structure
        if (data?.success) {
          if (Array.isArray(data.statuses)) {
            setJobs(data.statuses);
          } else if (Array.isArray(data.data)) { // Alternative common response format
            setJobs(data.data);
          } else {
            console.warn('Unexpected data format:', data);
            setJobs([]);
          }
        } else {
          setError(data.message || "No applications found");
          setJobs([]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAppliedJobs();
  }, []);
  if (loading) {
    return (
      <Card className="w-full max-w-4xl bg-white shadow-lg rounded-lg mt-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Applied Jobs
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-pulse">Loading your applications...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl bg-white shadow-lg rounded-lg mt-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Applied Jobs
          </h2>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center py-8">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="w-full max-w-4xl bg-white shadow-lg rounded-lg mt-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Applied Jobs
          </h2>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500 text-center py-8">
            You have not applied to any jobs yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl bg-white shadow-lg rounded-lg mt-6">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Applied Jobs
        </h2>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">
                  Applied Date
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">
                  Job Role
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">
                  Company
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.jobId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    {new Date(job.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b">{job.jobTitle}</td>
                  <td className="px-4 py-2 border-b">{job.companyName}</td>
                  <td className={`px-4 py-2 border-b ${getStatusStyle(job.status)}`}>
                    {formatStatus(job.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusStyle(status) {
  switch (status.toLowerCase()) {
    case "applied":
      return "text-blue-500";
    case "under_review":
      return "text-yellow-500";
    case "interview_invited":
      return "text-purple-500";
    case "interview_scheduled":
      return "text-indigo-500";
    case "accepted":
      return "text-green-500 font-semibold";
    case "rejected":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

function formatStatus(status) {
  // Convert snake_case to Title Case
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}