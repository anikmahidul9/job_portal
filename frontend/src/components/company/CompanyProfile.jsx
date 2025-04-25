import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CompanyForm from './CompanyForm';
import { getCompanyProfile} from '@/redux/recruiterSlice';
import { BuildingOffice2Icon, GlobeAltIcon, UsersIcon, InformationCircleIcon, PencilIcon } from '@heroicons/react/24/outline';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function CompanyProfile() {
  const dispatch = useDispatch();
  const currentCompany = useSelector((state) => state.recruiter.currentCompany);
  console.log('Current Company in Component:', currentCompany); // Debug log
  const loading = useSelector((state) => state.recruiter.loading);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    dispatch(getCompanyProfile());
  }, [dispatch]);

  if (loading) return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 animate-pulse">
        <div className="flex items-start space-x-6 mb-8">
          <Skeleton circle width={80} height={80} />
          <div className="flex-1 space-y-3">
            <Skeleton width={200} height={30} />
            <Skeleton width={150} height={20} />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton count={3} />
          <Skeleton width={100} />
          <Skeleton count={2} />
          <Skeleton width={100} />
          <Skeleton count={1} />
        </div>
      </div>
    </div>
  );

  if (!currentCompany) return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
          <BuildingOffice2Icon className="h-full w-full" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Company Registered</h2>
        <p className="text-gray-600 mb-6">Register your company to get started</p>
        
        {showCreateForm ? (
          <div className="mt-6">
            <CompanyForm 
              onSuccess={() => {
                setShowCreateForm(false);
                dispatch(getCompanyProfile());
              }} 
            />
            <button
              onClick={() => setShowCreateForm(false)}
              className="mt-4 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register Company
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header with logo */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex items-start space-x-6 border-b border-gray-100">
          {currentCompany.logo ? (
            <img 
              src={currentCompany.logo} 
              alt={`${currentCompany.name} logo`}
              className="w-20 h-20 rounded-lg object-cover border-4 border-white shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-white flex items-center justify-center border-4 border-white shadow-sm">
              <BuildingOffice2Icon className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{currentCompany.name}</h1>
            {currentCompany.website && (
              <a 
                href={currentCompany.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <GlobeAltIcon className="h-4 w-4 mr-1" />
                {currentCompany.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
          <button
            onClick={() => setShowUpdateForm(!showUpdateForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            {showUpdateForm ? 'Cancel Update' : 'Update Company'}
          </button>
        </div>

        {/* Main content */}
        <div className="p-6 space-y-8">
          {/* About section */}
          {currentCompany.description && (
            <div className="space-y-2">
              <div className="flex items-center text-gray-700">
                <InformationCircleIcon className="h-5 w-5 mr-2 text-indigo-500" />
                <h2 className="text-lg font-semibold">About Us</h2>
              </div>
              <p className="text-gray-600 pl-7 leading-relaxed">
                {currentCompany.description}
              </p>
            </div>
          )}

          {/* Company details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCompany.employees && (
              <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <UsersIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company Size</p>
                  <p className="font-medium text-gray-900">{currentCompany.employees} employees</p>
                </div>
              </div>
            )}
          </div>

          {/* Edit form - only shown when showUpdateForm is true */}
          {showUpdateForm && (
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Company Information</h3>
              <CompanyForm existingCompany={currentCompany} onSuccess={() => setShowUpdateForm(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}