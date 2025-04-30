/* eslint-disable react/prop-types */

const CompanyCard = ({ company }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4 hover:shadow-lg transition-shadow duration-300">
      <div className="md:flex">
        {/* Company Logo */}
        <div className="md:shrink-0 p-4 flex justify-center">
          <img 
            className="h-32 w-32 object-contain rounded-full border-2 border-gray-200" 
            src={company?.logo || '/default-company.png'} 
            alt={company?.name} 
          />
        </div>
        
        {/* Company Details */}
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
            {company?.industry || 'Technology'}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-1">{company?.name}</h2>
          
          <div className="mt-4">
            <p className="text-gray-600 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {company?.location || 'Location not specified'}
            </p>
            
            <p className="text-gray-600 flex items-center mt-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {company?.employeeCount || 'Unknown'} employees
            </p>
          </div>
          
          <div className="mt-4">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #{company?.type || 'Private'}
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #{company?.foundedYear || 'Est. N/A'}
            </span>
          </div>
          
          <p className="mt-4 text-gray-500 line-clamp-3">
            {company?.description || 'No description available.'}
          </p>
          
          <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            View Open Positions
          </button>
        </div>
      </div>
    </div>
  );
};

// Example usage:
// <CompanyCard company={{
//   name: "Tech Innovations Inc.",
//   logo: "/company-logo.png",
//   industry: "Software Development",
//   location: "San Francisco, CA",
//   employeeCount: "500+",
//   type: "Public",
//   foundedYear: "2010",
//   description: "Leading provider of enterprise software solutions..."
// }} />

export default CompanyCard;