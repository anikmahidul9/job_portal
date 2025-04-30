import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { getMyJobs } from '@/redux/recruiterSlice';
import { getApplicationsByJob, clearApplications, setCurrentJobId } from '@/redux/applicationSlice';
import ApplicantListModal from '../application/ApplicantListModel';

const MyJobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector(state => state.recruiter);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicants, setShowApplicants] = useState(false);

  useEffect(() => {
    dispatch(getMyJobs());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleViewApplicants = (job) => {
    if (!job?._id) {
      toast.error('Invalid job selected');
      return;
    }
  
    dispatch(setCurrentJobId(job._id)); // Add this line
    dispatch(getApplicationsByJob(job._id))
      .unwrap()
      .then(() => {
        setSelectedJob(job);
        setShowApplicants(true);
      })
      .catch(err => {
        toast.error(err.message || 'Failed to load applicants');
      });
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const capitalize = (str) => {
    return str.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">My Posted Jobs</h2>
          <span className="text-sm text-gray-500">
            {jobs?.length || 0} {jobs?.length === 1 ? 'job' : 'jobs'} posted
          </span>
        </div>
      </div>
      
      {loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading jobs...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-500">
          Failed to load jobs. Please try again.
        </div>
      ) : jobs?.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p className="mb-2">You havent posted any jobs yet.</p>
          <p className="text-sm">{`Click "Post Job" to create your first job listing.`}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map(job => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{job.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{capitalize(job.jobType)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{job.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(job.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleViewApplicants(job)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Applicants
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{showApplicants && selectedJob && (
        <ApplicantListModal
          job={selectedJob}
          onClose={() => {
            setShowApplicants(false);
            dispatch(clearApplications());
          }}
        />
      )}
    </div>
  );
};

export default MyJobs;