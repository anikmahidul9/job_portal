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
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "user",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    
    if (!input.name.trim()) newErrors.name = "Name is required";
    if (!input.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!input.password) {
      newErrors.password = "Password is required";
    } else if (input.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!input.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(input.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number";
    }
    if (!input.role) newErrors.role = "Please select a role";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, profilePhoto: "Please upload an image file (JPEG, PNG)" });
        return;
      }
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, profilePhoto: "File size should be less than 2MB" });
        return;
      }
      setProfilePhoto(file);
      setPreview(URL.createObjectURL(file));
      setErrors({ ...errors, profilePhoto: "" });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("role", input.role);
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(
          input.role === "recruiter" 
            ? "Registration successful! Your account is pending admin approval." 
            : "Registration successful!"
        );
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || "Registration failed";
      toast.error(errorMessage);
      
      // Clear sensitive fields on error
      setInput(prev => ({ ...prev, password: "" }));
      setProfilePhoto(null);
      setPreview("");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={submitHandler} className="space-y-4">
          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture (Optional)
            </label>
            <div className="flex items-center gap-4">
              {preview ? (
                <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-200">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">No photo</span>
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  id="profilePhoto"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                />
                {errors.profilePhoto && (
                  <p className="mt-1 text-sm text-red-600">{errors.profilePhoto}</p>
                )}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={input.name}
              onChange={changeEventHandler}
              placeholder="Enter your full name"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="Enter your email"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Enter your password (min 6 characters)"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
              }`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="Enter your phone number"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.phoneNumber ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
              }`}
            />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Register As:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  id="user"
                  name="role"
                  type="radio"
                  value="user"
                  checked={input.role === "user"}
                  onChange={changeEventHandler}
                  className="hidden peer"
                />
                <label
                  htmlFor="user"
                  className={`flex flex-col items-center justify-between p-3 border rounded-lg cursor-pointer ${
                    input.role === "user" ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
                  } ${errors.role ? 'border-red-500' : ''}`}
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
                />
                <label
                  htmlFor="recruiter"
                  className={`flex flex-col items-center justify-between p-3 border rounded-lg cursor-pointer ${
                    input.role === "recruiter" ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
                  } ${errors.role ? 'border-red-500' : ''}`}
                >
                  <span className="text-sm font-medium">Recruiter</span>
                </label>
              </div>
            </div>
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            <div className="text-sm text-center mt-4 text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-blue-600 hover:underline font-medium"
              >
                Log In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;