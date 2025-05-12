import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Home from './components/Home';
import JobsDescription from './components/JobsDescription';
import Browse from './components/Browse';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/admin/ProtectRoute';
import Unauthorized from './components/Unauthorized';
import NotFound from './components/NotFound';
import RecruiterRoute from './components/recruiter/ProtectedRoute';
import RecruiterDashboard from './components/recruiter/RecruiterDashboard';
import PaymentSuccess from './components/payment/PaymentSuccess';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/job',
    element: <JobsDescription />
  },
  {
    path: '/browse',
    element: <Browse />,
  },
  {
    path:'/payment/success',
    element: <PaymentSuccess />,

   },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },

  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin']} redirectPath="/unauthorized">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
   {
    path:'/recruiter/dashboard',
    element: (
      <RecruiterRoute allowedRoles={['recruiter']} redirectPath="/unauthorized">
        <RecruiterDashboard/>
      </RecruiterRoute>
    ),

   },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);

function App() {
  return (
    <RouterProvider router={appRouter} />
  );
}

export default App;