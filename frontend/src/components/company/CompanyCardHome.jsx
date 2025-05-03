/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

export function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/company/get');
        // const response = await fetch('https://job-portal-kc3x.onrender.com/api/v1/company/get');
        const data = await response.json();
        // Validate data is an array
        setCompanies(data.companies);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading companies...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (companies.length === 0) return <div className="p-4 text-center">No companies found</div>;

  return (
    <div className="max-w-7xl mx-auto my-20">
        <h1 className="text-4xl font-bold">
        <span className="text-[#6A38C2]"> Top </span> Companies
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 ">
      {companies.map(company => (
        <CompanyCard key={company._id} company={company} />
      ))}
    </div>
     </div>
  
  );
}

function CompanyCard({ company }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {company.logo ? (
            <img 
              src={company.logo} 
              alt={`${company.name} logo`}
              className="w-16 h-16 rounded-md object-contain"
            />
          ) : (
            <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-xl font-semibold">
              {company.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div>
            <h3 className="font-semibold text-lg">{company.name}</h3>
            {company.description && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {company.description}
              </p>
            )}
          </div>
        </div>
        
        {company.website && (
          <a
            href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
          >
            Visit Website
          </a>
        )}
      </div>
    </div>
  );
}