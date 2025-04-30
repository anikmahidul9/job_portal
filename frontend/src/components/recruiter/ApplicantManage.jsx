/* eslint-disable react/prop-types */
import { getApplicationsByJob, inviteForInterview, selectApplicationLoading, selectApplications, updateApplicationStatus } from '@/redux/applicationSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ApplicantManagement = ({ jobId }) => {
  const dispatch = useDispatch();
  const applications = useSelector(selectApplications);
  const loading = useSelector(selectApplicationLoading);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({
    date: '',
    time: '',
    meetingLink: '',
    notes: ''
  });

  useEffect(() => {
    dispatch(getApplicationsByJob(jobId));
  }, [dispatch, jobId]);

  const handleStatusChange = (applicationId, status) => {
    dispatch(updateApplicationStatus({ applicationId, status }));
  };

  const handleInviteSubmit = () => {
    dispatch(inviteForInterview({
      applicationId: selectedApplication,
      interviewDetails
    }));
    setSelectedApplication(null);
  };

  if (loading) return <div>Loading applicants...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Applicants</h2>
      
      {applications.map((application) => (
        <div key={application._id} className="border p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">{application.applicant.name}</h3>
              <p>{application.applicant.email}</p>
              <div className={`inline-block px-2 py-1 mt-2 text-xs rounded-full ${
                application.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                application.status === 'interview_invited' ? 'bg-yellow-100 text-yellow-800' :
                application.status === 'hired' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {application.status.replace('_', ' ')}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <select
                value={application.status}
                onChange={(e) => handleStatusChange(application._id, e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="applied">Applied</option>
                <option value="interview_invited">Interview</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <button
                onClick={() => setSelectedApplication(application._id)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Schedule Interview
              </button>
            </div>
          </div>

          {selectedApplication === application._id && (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-medium mb-2">Schedule Interview</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm">Date</label>
                  <input
                    type="date"
                    value={interviewDetails.date}
                    onChange={(e) => setInterviewDetails({...interviewDetails, date: e.target.value})}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm">Time</label>
                  <input
                    type="time"
                    value={interviewDetails.time}
                    onChange={(e) => setInterviewDetails({...interviewDetails, time: e.target.value})}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-sm">Meeting Link</label>
                <input
                  type="text"
                  placeholder="https://meet.google.com/xyz"
                  value={interviewDetails.meetingLink}
                  onChange={(e) => setInterviewDetails({...interviewDetails, meetingLink: e.target.value})}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm">Notes</label>
                <textarea
                  value={interviewDetails.notes}
                  onChange={(e) => setInterviewDetails({...interviewDetails, notes: e.target.value})}
                  className="border rounded px-2 py-1 w-full"
                  rows={3}
                />
              </div>
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteSubmit}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApplicantManagement;