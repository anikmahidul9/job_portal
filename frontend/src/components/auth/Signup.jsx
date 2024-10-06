import { USER_API_ENDPOINT } from "@/utils/constant";
import { setLoading } from "@/redux/authSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input,setInput] = useState({
    name:"",
    email:"",
    password:"",
    phoneNumber:"",
    role:"",
    file:""
  })

  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e)=>{
    setInput({...input,[e.target.name]:e.target.value})
  }
  const changeFileHandler=(e)=>{
    setInput({...input,file:e.target.files?.[0]})
    
  }

  const submitHandler = async (e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("role", input.role);
    if(input.file){
       formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(res);
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (err) {
      console.error(err);
      // setInput({name: "", email: "", password: "", phoneNumber:"", role:"", file:""})
    } finally {
      dispatch(setLoading(false));
    }
    console.log(input);
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={submitHandler} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={input.name}
              onChange={changeEventHandler}
              placeholder="Enter your full name"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

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

          {/*Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="number"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="Enter your Phone number"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          {/* Radio Buttons */}
          <div className="flex items-center space-x-4">
            <label className="block text-sm font-medium text-gray-700">
              Sign Up As:
            </label>
            <div className="flex items-center">
              <input
                id="student"
                name="role"
                type="radio"
                value="student"
                checked={input.role == "student"}
                onChange={changeEventHandler}
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

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={changeFileHandler}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>

          {/* Submit Button */}
          <div>
            {loading ? (
              <Button className="w-full px-4 py-2">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Sign Up
              </button>
            )}

            <span className="text-small text-gray-700">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600">
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup