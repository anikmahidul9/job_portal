/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import axios from "axios";
import { CompanyCardHome } from "./CompanyCardHome";
import Skeleton from "react-loading-skeleton";

export function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/company/get');
        // const response = await axios.get('https://job-portal-kc3x.onrender.com/api/v1/company/get');
        setCompanies(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error loading companies: {error}
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No companies found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <CompanyCardHome key={company._id} company={company} />
      ))}
    </div>
  );
}