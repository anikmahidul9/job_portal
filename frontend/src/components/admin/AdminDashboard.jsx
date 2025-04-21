import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  fetchAllUsers } from '@/redux/adminSlice';
import UsersList from './UserList';


const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  // 1. Log entire Redux state
  const fullState = useSelector(state => state);
  console.log('FULL REDUX STATE:', fullState);

  // 2. Separate auth and admin state access
  const auth = useSelector(state => state.auth);
  const admin = useSelector(state => state.admin);
  
  console.log('AUTH STATE:', auth);
  console.log('ADMIN STATE:', admin);

  // 3. Destructure with defaults
  const { user, isAuthenticated } = auth || {};
  const { users = [], loading = false, error = null } = admin || {};

  useEffect(() => {
    console.log('EFFECT - User:', user, 'Auth:', isAuthenticated);
    
    if (isAuthenticated && user?.role === 'admin') {
      console.log('Dispatching admin actions');
      dispatch(fetchAllUsers());
    }
  }, [dispatch, user, isAuthenticated]);
    console.log(users)
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Pending Recruiters</h2>
          {/* Add pending recruiters list here */}
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Users</h2>
          <UsersList users={users} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;