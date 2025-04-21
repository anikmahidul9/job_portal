import { loginFailed, setAuthUser, setLoading } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/constant";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { loading } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!input.role) {
      toast.error("Please select a role");
      return;
    }
  
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
  
        // Verify response structure before dispatching
        if (res.data.success) {
          if (!res.data.user || !res.data.user.role) {
            throw new Error("Invalid user data in response");
          }
          dispatch(setAuthUser({
            user: res.data.user,
            token: res.data.token  // Make sure API returns token
          }));

        
        
        // Store token if needed
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
  
        // Immediate hard redirect for admin
        if (res.data.user.role === 'admin') {
          console.log(res.data.user);
          window.location.href = '/admin/dashboard';
          return;
        }
        
        // For other users
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      dispatch(loginFailed(err.response?.data?.error || "Login failed"));
      toast.error(err.response?.data?.error || "Login failed");
      setInput(prev => ({ ...prev, password: "" }));
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
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
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
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sign In As:
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  id="student"
                  name="role"
                  type="radio"
                  value="user"  // Changed from "student" to match your backend
                  checked={input.role === "user"}
                  onChange={changeEventHandler}
                  className="hidden peer"
                  required
                />
                <label
                  htmlFor="student"
                  className={`flex flex-col items-center justify-between p-3 border rounded-lg cursor-pointer 
                    ${input.role === "user" ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  <span className="text-sm font-medium">Candidate</span>
                </label>
              </div>
              
              <div>
                <input
                  id="recruiter"
                  name="role"
                  type="radio"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="hidden peer"
                  required
                />
                <label
                  htmlFor="recruiter"
                  className={`flex flex-col items-center justify-between p-3 border rounded-lg cursor-pointer 
                    ${input.role === "recruiter" ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  <span className="text-sm font-medium">Recruiter</span>
                </label>
              </div>
              
              <div>
                <input
                  id="admin"
                  name="role"
                  type="radio"
                  value="admin"
                  checked={input.role === "admin"}
                  onChange={changeEventHandler}
                  className="hidden peer"
                />
                <label
                  htmlFor="admin"
                  className={`flex flex-col items-center justify-between p-3 border rounded-lg cursor-pointer 
                    ${input.role === "admin" ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  <span className="text-sm font-medium">Admin</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-sm text-center text-gray-600">
              Dont have an account?{" "}
              <Link 
                to="/signup" 
                className="text-blue-600 hover:underline font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;