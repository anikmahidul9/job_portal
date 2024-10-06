import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AppliedJobTable() {
  const jobs = [
    {
      date: "2024-10-01",
      role: "Frontend Developer",
      company: "Tech Corp",
      status: "Pending",
    },
    {
      date: "2024-09-20",
      role: "Backend Developer",
      company: "Innovate Inc.",
      status: "Interviewed",
    },
    {
      date: "2024-08-15",
      role: "Full Stack Developer",
      company: "Web Solutions",
      status: "Accepted",
    },
    {
      date: "2024-07-30",
      role: "Software Engineer",
      company: "Global IT",
      status: "Rejected",
    },
  ];

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
                  Date
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
              {jobs.map((job, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{job.date}</td>
                  <td className="px-4 py-2 border-b">{job.role}</td>
                  <td className="px-4 py-2 border-b">{job.company}</td>
                  <td
                    className={`px-4 py-2 border-b ${getStatusStyle(
                      job.status
                    )}`}
                  >
                    {job.status}
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

// Function to add color styles to status based on the job application status
function getStatusStyle(status) {
  switch (status) {
    case "Pending":
      return "text-yellow-500";
    case "Interviewed":
      return "text-blue-500";
    case "Accepted":
      return "text-green-500 font-semibold";
    case "Rejected":
      return "text-red-500";
    default:
      return "";
  }
}
