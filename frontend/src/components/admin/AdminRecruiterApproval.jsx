// AdminRecruiterApproval.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingRecruiters, approveRecruiter, rejectRecruiter } from '@/redux/adminSlice';

const AdminRecruiterApproval = () => {
  const dispatch = useDispatch();
  const { pendingRecruiters, loading, error } = useSelector(state => state.admin);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    dispatch(fetchPendingRecruiters());
  }, [dispatch]);

  const handleApprove = (recruiterId) => {
    dispatch(approveRecruiter(recruiterId));
  };

  const handleReject = (recruiterId) => {
    if (!rejectionReason) {
      alert('Please enter a rejection reason');
      return;
    }
    dispatch(rejectRecruiter({ recruiterId, reason: rejectionReason }));
    setRejectionReason('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Pending Recruiter Approvals</h2>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {pendingRecruiters.length === 0 ? (
        <p className="text-gray-500">No pending recruiters</p>
      ) : (
        <div className="space-y-4">
          {pendingRecruiters.map(recruiter => (
            <div key={recruiter._id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{recruiter.name}</h3>
                <p className="text-sm text-gray-600">{recruiter.email}</p>
                <p className="text-sm text-gray-600">{recruiter.phoneNumber}</p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApprove(recruiter._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Rejection reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  />
                  <button
                    onClick={() => handleReject(recruiter._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRecruiterApproval;