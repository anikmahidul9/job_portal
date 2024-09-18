import { USER_API_ENDPOINT } from "@/utils/constant";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
   const [input, setInput] = useState({
     email: "",
     password: "",
     role: "",

   });

   const navigate = useNavigate();

   const changeEventHandler = (e) => {
     setInput({ ...input, [e.target.name]: e.target.value });
   };

  const submitHandler = async (e) => {
    e.preventDefault();
 

    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error signing up");
      setInput({
        email: "",
        password: "",
      
      });
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={submitHandler} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="Enter your email"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Enter your password"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          {/* Radio Buttons */}
          <div className="flex items-center space-x-4">
            <label className="block text-sm font-medium text-gray-700">
              Sign In As:
            </label>
            <div className="flex items-center">
              <input
                id="student"
                name="role"
                value="student"
                checked={input.role == "student"}
                onChange={changeEventHandler}
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required
              />
              <label
                htmlFor="student"
                className="ml-2 block text-sm text-gray-700"
              >
                Student
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="recruiter"
                name="role"
                type="radio"
                value="recruiter"
                checked={input.role == "recruiter"}
                onChange={changeEventHandler}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required
              />
              <label
                htmlFor="recruiter"
                className="ml-2 block text-sm text-gray-700"
              >
                Recruiter
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Sign In
            </button>
            <span className="text-small text-gray-700">
              Already have an account?{" "}
              <Link to="/signup" className="text-blue-600">
                Sign Up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login