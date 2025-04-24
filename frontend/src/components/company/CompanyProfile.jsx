/* eslint-disable react/prop-types */
// CompanyProfile.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CompanyForm from './CompanyForm';
import { getCompanyProfile } from '@/redux/recruiterSlice';


export default function CompanyProfile() {
    const dispatch = useDispatch();
  const currentCompany = useSelector((state) => state.recruiter.currentCompany);
  const loading = useSelector((state) => state.recruiter.loading);

  useEffect(() => {
    if (!currentCompany) {
      dispatch(getCompanyProfile());
    }
  }, [dispatch, currentCompany]);

  console.log('Current Company Data:', currentCompany); // Debug log

  if (loading) return <div>Loading...</div>;
  if (!currentCompany) return <div>No company registered</div>;

  return (
    <div>
      {currentCompany ? (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-6">
            {currentCompany.logo && (
              <img 
                src={currentCompany.logo} 
                alt={`${currentCompany.name} logo`}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{currentCompany.name}</h1>
              {currentCompany.website && (
                <a 
                  href={currentCompany.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {currentCompany.website}
                </a>
              )}
            </div>
          </div>
          
          {currentCompany.description && (
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">About Us</h2>
              <p className="text-gray-700">{currentCompany.description}</p>
            </div>
          )}
          
          {currentCompany.employees && (
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Company Size</h2>
              <p className="text-gray-700">{currentCompany.employees} employees</p>
            </div>
          )}
          
          <CompanyForm existingCompany={currentCompany} />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">You havent registered a company yet</h2>
          <CompanyForm />
        </div>
      )}
    </div>
  );
}