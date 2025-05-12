import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab } from '@headlessui/react';
import MyJobs from './MyJobs';
import PostJobForm from './PostJobForm';
import CompanyProfile from '../company/CompanyProfile';
import Navbar from '../shared/Navbar';
import { fetchAllJobs } from '@/redux/jobSlice';
import JobListings from './JobListings';


const RecruiterDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.jobs); // Access jobs from the Redux store


  useEffect(() => {
    dispatch(fetchAllJobs()); // Fetch jobs on component mount
  }, [dispatch]);

  return (
    <>
      <Navbar/>

    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your jobs and company profile
        </p>
      </div>

      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-lg bg-blue-100 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              `w-full py-2.5 text-sm font-medium rounded-lg transition-colors ${
                selected ? 'bg-white shadow text-blue-700' : 'text-blue-500 hover:bg-blue-50'
              }`
            }
          >
            Post New Job
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-2.5 text-sm font-medium rounded-lg transition-colors ${
                selected ? 'bg-white shadow text-blue-700' : 'text-blue-500 hover:bg-blue-50'
              }`
            }
          >
            My Jobs
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-2.5 text-sm font-medium rounded-lg transition-colors ${
                selected ? 'bg-white shadow text-blue-700' : 'text-blue-500 hover:bg-blue-50'
              }`
            }
          >
            Company Profile
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-2.5 text-sm font-medium rounded-lg transition-colors ${
                selected ? 'bg-white shadow text-blue-700' : 'text-blue-500 hover:bg-blue-50'
              }`
            }
          >
            Payment
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <PostJobForm companyId={user?.company} />
          </Tab.Panel>
          <Tab.Panel>
            <MyJobs onJobSelect={jobs}/>
          </Tab.Panel>
          <Tab.Panel>
            <CompanyProfile companyId={user?.company} />
          </Tab.Panel>
          <Tab.Panel>
           <JobListings/>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
    </>
  );
};

export default RecruiterDashboard;