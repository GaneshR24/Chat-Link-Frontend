import React from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetAllChats } from "../apicalls/chats";
import { GetAllUsers, GetCurrentUser } from "../apicalls/users";
import { HideLoader, ShowLoader } from "../redux/loaderSlice";
import { SetAllUsers, SetUser, SetAllChats } from "../redux/userSlice";
import { io } from "socket.io-client";
import { SiLivechat } from "react-icons/si";
import { MdOutlinePerson, MdOutlineLogout } from "react-icons/md";

const socket = io("https://chatlink-application.onrender.com");
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userReducer);

  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoader());
      const response = await GetCurrentUser();
      const allUsersResponse = await GetAllUsers();
      const allChatsResponse = await GetAllChats();
      dispatch(HideLoader());
      if (response.success) {
        dispatch(SetUser(response.data));
        dispatch(SetAllUsers(allUsersResponse.data));
        dispatch(SetAllChats(allChatsResponse.data));
      } else {
        toast.error(response.message);
        navigate("/login");
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div className="h-screen w-screen bg-gray-100 p-2">
        {/* Header */}
        <div className="flex justify-between p-5 bg-primary rounded">
          <div className="flex items-center gap-1">
            <SiLivechat className="text-3xl  text-white" />
            <h1
              className="text-white text-3xl font-bold cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            >
              Chat Link
            </h1>
          </div>
          <div className="flex gap-2 text-md items-center bg-white p-2 rounded">
            {user?.profilePic && (
              <img
                src={user?.profilePic}
                alt="profile"
                className="h-8 w-8 rounded-full object-cover cursor-pointer"
                onClick={() => {
                  navigate("/profile");
                }}
              />
            )}
            {!user?.profilePic && (
              <MdOutlinePerson className=" text-primary text-2xl" />
            )}
            <h1
              className="text-primary cursor-pointer"
              onClick={() => {
                navigate("/profile");
              }}
            >
              {user?.name}
            </h1>
            <MdOutlineLogout
              className="ml-4 text-2xl cursor-pointer text-primary"
              onClick={() => {
                socket.emit("went-offline", user._id);
                localStorage.removeItem("token");
                navigate("/login");
              }}
            />
          </div>
        </div>

        {/* Main Content Pages */}
        <div className="py-5">{children}</div>
      </div>
    </>
  );
};

export default ProtectedRoute;
