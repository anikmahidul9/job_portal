/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const InterviewInvitationModal = ({ application, onClose, onInvite }) => {
    const [interviewDetails, setInterviewDetails] = useState({
        date: '',
        time: '',
        location: '',
        notes: '',
        meetingLink: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onInvite(interviewDetails);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInterviewDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Schedule Interview
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={interviewDetails.date}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time
                        </label>
                        <input
                            type="time"
                            name="time"
                            value={interviewDetails.time}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location/Platform
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={interviewDetails.location}
                            onChange={handleChange}
                            placeholder="Office address or Zoom link"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meeting Link (if online)
                        </label>
                        <input
                            type="url"
                            name="meetingLink"
                            value={interviewDetails.meetingLink}
                            onChange={handleChange}
                            placeholder="https://zoom.us/j/..."
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Notes
                        </label>
                        <textarea
                            name="notes"
                            value={interviewDetails.notes}
                            onChange={handleChange}
                            placeholder="Any special instructions"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows={3}
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Send Invitation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InterviewInvitationModal;