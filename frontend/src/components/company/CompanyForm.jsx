/* eslint-disable react/prop-types */
// CompanyForm.jsx
import {  registerCompany, updateCompanyProfile } from '@/redux/recruiterSlice';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


export default function CompanyForm({ existingCompany }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.recruiter) || {};
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    logo: '',
    employees: ''
  });

  useEffect(() => {
    if (existingCompany) {
      setFormData({
        name: existingCompany.name || '',
        description: existingCompany.description || '',
        website: existingCompany.website || '',
        logo: existingCompany.logo || '',
        employees: existingCompany.employees || ''
      });
    }
  }, [existingCompany]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingCompany) {
      await dispatch(updateCompanyProfile({ companyId: existingCompany._id, updateData: formData }));
    } else {
      await dispatch(registerCompany(formData));
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">
        {existingCompany ? 'Update Company' : 'Register Your Company'}
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo URL</label>
            <input
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.logo}
              onChange={(e) => setFormData({...formData, logo: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Employees</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.employees}
              onChange={(e) => setFormData({...formData, employees: e.target.value})}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : existingCompany ? 'Update Company' : 'Register Company'}
          </button>
        </div>
      </form>
    </div>
  );
}