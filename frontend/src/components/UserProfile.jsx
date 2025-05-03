import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "./shared/Navbar";
import AppliedJobTable from "./AppliedJobTables";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/constant";

export default function UserProfile() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const isRecruiterOrAdmin = ['recruiter', 'admin'].includes(user?.role);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    bio: '',
    skills: [],
    resume: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.profile?.bio || '',
        skills: user.profile?.skills || [],
        resume: user.profile?.resume || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedResume(file);
      // Show the file name to user
      setFormData(prev => ({
        ...prev,
        resume: file.name
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('skills', formData.skills.join(','));
      
      // Append resume file if selected
      if (selectedResume) {
        formDataToSend.append('resume', selectedResume);
      }

      const response = await axios.put(`${USER_API_ENDPOINT}/upload-resume`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update Redux store with new user data
      dispatch(setAuthUser({ 
        user: response.data.user, 
        token: localStorage.getItem('token') 
      }));
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setSelectedResume(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

 

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-8">
          <CardHeader>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32 rounded-full border-4 border-blue-500">
                <AvatarImage
                  src={`http://localhost:8000${user.profile.profilePhoto}`}
                  // src={`https://job-portal-kc3x.onrender.com${user.profile?.profilePhoto}`}
                  alt="Profile"
                />
              </Avatar>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">
                  {user?.name}
                </h2>
                <p className="text-lg text-gray-500">{user?.email}</p>
                {!isRecruiterOrAdmin && (
                  <p className="text-lg text-gray-500">{user?.phoneNumber}</p>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="mt-8 space-y-6">
            {!isRecruiterOrAdmin ? (
              <div className="space-y-4">
                {user?.profile?.bio && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700">Bio</h3>
                    <p className="text-gray-600">{user.profile.bio}</p>
                  </div>
                )}
                {user?.profile?.skills?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.profile.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {user?.profile?.resume && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700">Resume</h3>
                    <a 
                      href={`http://localhost:8000${user.profile.resume}`}
                      // href={`https://job-portal-kc3x.onrender.com${user.profile.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg text-gray-600">
                  <span className="font-semibold">Role:</span> {user?.role?.toUpperCase()}
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white hover:bg-blue-700 mt-6 px-6 py-3 rounded-full"
              >
                Edit Profile
              </Button>
            </div>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild />
              <DialogContent className="p-6 rounded-lg shadow-lg bg-white max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Edit Profile
                  </h2>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  <div>
                    <Label htmlFor="name" className="text-lg font-medium text-gray-700">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-lg font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-lg font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                      required
                    />
                  </div>
                  
                  {!isRecruiterOrAdmin && (
                    <>
                      <div>
                        <Label htmlFor="bio" className="text-lg font-medium text-gray-700">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="skills" className="text-lg font-medium text-gray-700">
                          Skills (comma separated)
                        </Label>
                        <Input
                          id="skills"
                          name="skills"
                          type="text"
                          value={formData.skills?.join(', ')}
                          onChange={(e) => {
                            const skillsArray = e.target.value.split(',').map(skill => skill.trim());
                            setFormData({...formData, skills: skillsArray});
                          }}
                          className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                          placeholder="e.g., JavaScript, React, Node.js"
                        />
                      </div>
                      <div>
                        <Label htmlFor="resume" className="text-lg font-medium text-gray-700">
                          Resume (PDF only)
                        </Label>
                        <Input
                          id="resume"
                          name="resume"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                        />
                        {formData.resume && (
                          <div className="mt-2 text-sm text-gray-600">
                            {selectedResume ? "New file selected" : `Current resume: ${formData.resume.split('/').pop()}`}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
          
          {!isRecruiterOrAdmin && (
            <div className="mt-8">
              <AppliedJobTable />
            </div>
          )}
        </Card>
      </div>
    </>
  );
}