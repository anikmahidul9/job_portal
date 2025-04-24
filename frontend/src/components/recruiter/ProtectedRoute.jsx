/* eslint-disable react/prop-types */
// ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const RecruiterRoute = ({ children }) => {
  const { user } = useSelector(state => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'recruiter' || !user.isApproved) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RecruiterRoute;