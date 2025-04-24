import { LogOut, User2, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";

const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    navigate('/'); 
  };


  return (
    <div className="bg-white shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        <div>
          <Link to="/">
            <h1 className="text-2xl font-bold">
              Job <span className="text-[#36A853]">Portal</span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-4">
          <ul className="hidden md:flex gap-6 font-medium">
            <li>
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/job" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Jobs
              </Link>
            </li>
            <li>
              <Link 
                to="/browse" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Browse
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li>
                <Link 
                  to="/admin/dashboard" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            )}
            {user?.role === 'recruiter' && (
              <li>
                <Link 
                  to="/recruiter/dashboard" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
          
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="hover:bg-gray-100">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="ghost" className="bg-[#36A853] text-white hover:bg-[#2d8a43]">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.profile?.profilePhoto || "https://github.com/shadcn.png"}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-2">
                <div className="flex flex-col gap-1">
                  <div className="px-2 py-1.5">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>
                  
                  <Link to="/profile">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2 text-sm"
                    >
                      <User2 className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2 text-sm"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  {user.role === 'recruiter' && (
                    <Link to="/recruiter/dashboard">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2 text-sm"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2 text-sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;