/* eslint-disable react/prop-types */
import { useDispatch } from 'react-redux';
import { updateApplicationStatus } from '@/redux/applicationSlice';
import { toast } from 'sonner';
import { useState } from 'react';
import InterviewInvitationModal from './InterviewIntervationModer';

const statusColors = {
  applied: 'bg-blue-100 text-blue-800',
  interview_invited: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800',
  hired: 'bg-green-100 text-green-800'
};

const ApplicantRow = ({ application }) => {
  const dispatch = useDispatch();
const [showInviteModal, setShowInviteModal] = useState(false);

const handleStatusUpdate = (status) => {
    dispatch(updateApplicationStatus({ 
        applicationId: application._id, 
        status 
    }))
    .unwrap()
    .then(() => toast.success(`Status updated to ${status}`))
    .catch(err => toast.error(err.message || 'Update failed'));
};


  return (
    <>
    <tr key={application._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img 
              className="h-10 w-10 rounded-full" 
              src={application.applicant?.profile?.profilePhoto || '/default-avatar.png'} 
              alt={application.applicant?.name} 
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {application.applicant?.name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {application.applicant?.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <div>
                    <a 
                      href={`http://localhost:8000${application.applicant.profile?.resume}`}
                      // href={`https://job-portal-kc3x.onrender.com${application.applicant.profile?.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          statusColors[application.status] || 'bg-gray-100 text-gray-800'
        }`}>
          {application.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                    >
                        Invite
                    </button>
                    <button
                        onClick={() => handleStatusUpdate('hired')}
                        className="text-green-600 hover:text-green-900 mr-3"
                    >
                        Hire
                    </button>
                    <button
                        onClick={() => handleStatusUpdate('rejected')}
                        className="text-red-600 hover:text-red-900"
                    >
                        Reject
                    </button>
                </td>
            </tr>
              {showInviteModal && (
                <InterviewInvitationModal
                    application={application}
                    onClose={() => setShowInviteModal(false)}
                    onInvite={(interviewDetails) => {
                        dispatch(updateApplicationStatus({
                            applicationId: application._id,
                            status: 'interview_invited',
                            interviewDetails
                        }))
                        .unwrap()
                        .then(() => {
                            toast.success('Interview invitation sent!');
                            setShowInviteModal(false);
                        })
                        .catch(err => toast.error(err.message || 'Failed to send invitation'));
                    }}
                />
            )}
            </>
  );
};

export default ApplicantRow;