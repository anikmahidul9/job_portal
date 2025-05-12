import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { getMyJobs } from '@/redux/recruiterSlice';
import PaymentButton from '../payment/PaymentButton';

const JobListings = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector(state => state.recruiter);
  const [jobCount, setJobCount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    dispatch(getMyJobs())
      .unwrap()
      .then((response) => {
        setJobCount(response?.length || 0);
      });
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handlePostNewJob = () => {
    if (jobCount >= 2) {
      setShowPaymentModal(true);
    } else {
      toast.info('You can post your job for free');
      // navigate('/post-job');
    }
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
          <h2 className="text-xl font-semibold text-gray-800">Job Listings</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {jobCount} {jobCount === 1 ? 'job' : 'jobs'} found
              {jobCount >= 5 && (
                <span className="ml-2 text-red-500">
                  (100 TK per additional job)
                </span>
              )}
            </span>
            <button
              onClick={handlePostNewJob}
              className="px-4 py-2 bg-[#36A853] text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Post New Job
            </button>
          </div>
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
          <p className="mb-2">No jobs found</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status || 'active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPaymentModal && (
 
        <PaymentButton amount={100 * (jobCount - 4)}
           onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default JobListings;