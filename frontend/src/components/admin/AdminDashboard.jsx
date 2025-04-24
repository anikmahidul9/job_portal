import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '@/redux/adminSlice';
import UsersList from './UserList';
import AdminRecruiterApproval from './AdminRecruiterApproval';
import Navbar from '../shared/Navbar';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const admin = useSelector(state => state.admin);
  
  const { user, isAuthenticated } = auth || {};
  const { users = [], loading = false, error = null } = admin || {};

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, user, isAuthenticated]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>You dont have admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      <Navbar/>
      {/* Dashboard Header */}
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage all users and recruiters in the system
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8">
        <AdminRecruiterApproval />
        {/* Other admin components */}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Full Width Users List */}
      {!loading && !error && (
        <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
              <p className="mt-1 text-sm text-gray-600">
                Showing {users.length} registered {users.length === 1 ? 'user' : 'users'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100">
                Export
              </button>
              <button className="px-3 py-1 bg-green-50 text-green-600 rounded-md text-sm hover:bg-green-100">
                Refresh
              </button>
            </div>
          </div>
          
          {/* Full Width Table Container */}
          <div className="w-full overflow-x-auto">
            <UsersList users={users} />
          </div>

          {/* Table Footer */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-right">
            <p className="text-sm text-gray-500">
              {users.length} results
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;