/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { postJob } from '@/redux/recruiterSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const PostJobForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        jobType: 'full-time',
        salary: '',
        skills: '',
        position: ''
      });
      const jobTypes = [
        'govt',
        'full-time',
        'part-time',
        'contract',
        'internship',
        'remote'
      ];
      
      const [isSubmitting, setIsSubmitting] = useState(false);
      const dispatch = useDispatch();
      const { user } = useSelector(state => state.auth);
      const { currentCompany } = useSelector(state => state.recruiter);
    
      useEffect(() => {
        if (!currentCompany) {
          toast.error('Please register a company first');
        }
      }, [currentCompany]);
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentCompany?._id) {
          toast.error('No company registered');
          return;
        }
    
        const requiredFields = {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          jobType: formData.jobType
        };
    
        if (Object.values(requiredFields).some(field => !field)) {
          toast.error('Please fill all required fields');
          return;
        }
    
        setIsSubmitting(true);
        
        try {
          const payload = {
            ...requiredFields,
            company: currentCompany._id, // Use the company ID from Redux state
            salary: formData.salary,
            position: formData.position,
            skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
            created_by: user._id
          };
    
          await dispatch(postJob(payload)).unwrap();
          toast.success('Job posted successfully!');
          
          // Reset form
          setFormData({
            title: '',
            description: '',
            location: '',
            jobType: 'full-time',
            salary: '',
            skills: '',
            position: ''
          });
        } catch (error) {
          console.error('Job post error:', error);
          toast.error(error.error || error.message || 'Failed to post job');
        } finally {
          setIsSubmitting(false);
        }
      };
    

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Post New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Title */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title*</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="e.g. Senior React Developer"
            />
          </div>
          
          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position*</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="e.g. Senior Developer"
            />
          </div>
          
          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type*</label>
            <select
              value={formData.jobType}
              onChange={(e) => setFormData({...formData, jobType: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {jobTypes.map(type => (
                <option key={type} value={type}>
                  {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>
          
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="e.g. New York, NY"
            />
          </div>
          
          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
            <input
              type="text"
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. $80,000 - $100,000"
            />
          </div>
          
          {/* Skills */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. React, Node.js, MongoDB"
            />
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Description*</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={6}
            required
            placeholder="Detailed job description..."
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobForm;