import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { toast } from "react-hot-toast";
import { HideLoader, ShowLoader } from "../../redux/loaderSlice";
import { UpdateProfilePicture } from "../../apicalls/users";
import { SetUser } from "../../redux/userSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.userReducer);
  const [image = "", setImage] = useState("");
  const dispatch = useDispatch();

  const onFileSelect = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      console.log(reader.result);
      setImage(reader.result);
    };
  };

  useEffect(() => {
    if (user?.profilePic) {
      setImage(user.profilePic);
    }
  }, [user]);

  const updateProfilePic = async () => {
    try {
      dispatch(ShowLoader());
      const response = await UpdateProfilePicture(image);
      dispatch(HideLoader());
      if (response.success) {
        toast.success("Profile Pic Updated");
        dispatch(SetUser(response.data));
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  return (
    user && (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-xl font-semibold uppercase text-gray-500 flex gap-2 flex-col p-5 shadow-md border w-max border-gray-400 rounded">
          <h1>{user.name}</h1>
          <h1>{user.email}</h1>
          <h1>
            Created At:{" "}
            {moment(user.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
          </h1>
          {image && (
            <img
              src={image}
              alt="profile pic"
              className="w-32 h-32 rounded-full"
            />
          )}
          <div className="flex gap-2">
            <label htmlFor="file-input" className="cursor-pointer">
              Update Profile Pic
            </label>
            <input
              type="file"
              onChange={onFileSelect}
              className="file-input border-0 cursor-pointer"
              id="file-input"
            />
            <button
              className="border-2 border-primary text-primary rounded-full px-8 py-2 inline-block font-semibold hover:bg-primary hover:text-white"
              onClick={updateProfilePic}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
