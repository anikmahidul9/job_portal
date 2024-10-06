import { useState } from "react";
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
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/constant";
import { setAuthUser } from "@/redux/authSlice";

export default function UserProfile() {
  // Dummy user data
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    resume: user?.profile?.resume || "",
    profilePhoto: user?.profile?.profilePhoto || "",
  });

       console.log(formData);
  

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
     const updateData = {
       name: formData.name,
       phoneNumber: formData.phoneNumber,
         bio: formData.bio,
         skills: formData.skills.split(",").map((skill) => skill.trim()), 
         resume: formData.resume||"",
         profilePhoto: formData.profilePhoto||"",

     };


   try{
    const res = await axios.post(
      `${USER_API_ENDPOINT}/profile/update`,
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    if(res.data.success){
      dispatch(setAuthUser(res.data.user))
      
    }
   }catch(err){
      console.log(err);
   }
    setIsEditing(false);
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
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
              </Avatar>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">
                  {user?.name}
                </h2>
                <p className="text-lg text-gray-500">{user?.email}</p>
                <p className="text-lg text-gray-500">{user?.phone}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="mt-8">
            <div className="text-center space-y-4">
              <p className="text-xl text-gray-600 font-light">
                {user?.profile?.bio}
              </p>
              <p className="text-lg text-gray-600 font-light">
                <strong>Skills: </strong>
                {user?.profile?.skills?.join(", ")}
              </p>
              <p className="text-lg text-gray-600 font-light">
                <strong>Resume: </strong>
                {user?.profile?.resume}
              </p>

              {/* Edit Button */}
              <Button
                onClick={handleEditClick}
                className="bg-blue-600 text-white hover:bg-blue-700 mt-6 px-6 py-3 rounded-full"
              >
                Edit Profile
              </Button>

              {/* Edit Dialog */}
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild />
                <DialogContent className="p-6 rounded-lg shadow-lg bg-white max-w-lg">
                  <DialogHeader>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Edit Profile
                    </h2>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-lg font-medium text-gray-700"
                      >
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-lg font-medium text-gray-700"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-lg font-medium text-gray-700"
                      >
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phoneNumber"
                        type="text"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="bio"
                        className="text-lg font-medium text-gray-700"
                      >
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="skills"
                        className="text-lg font-medium text-gray-700"
                      >
                        Skills
                      </Label>
                      <Input
                        id="skills"
                        name="skills"
                        type="text"
                        value={formData.skills}
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="resume"
                        className="text-lg font-medium text-gray-700"
                      >
                        Resume
                      </Label>
                      <Input
                        id="resume"
                        name="resume"
                        type="text"
                        value={formData.resume}
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                      />
                    </div>

                    {/* Save Button */}
                    <Button
                      onClick={handleSave}
                      className="bg-green-600 text-white hover:bg-green-700 mt-6 px-6 py-3 rounded-full w-full"
                    >
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
          <div className="text-left">
            <AppliedJobTable />
          </div>
        </Card>
      </div>
    </>
  );
}
