import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ChatArea from "./components/ChatArea";
import UserSearch from "./components/UserSearch";
import UsersList from "./components/UsersList";
import { io } from "socket.io-client";

const socket = io("https://chatlink-application.onrender.com");
localStorage.setItem("socket", socket);
const Home = () => {
  const [searchKey, setSearchKey] = useState("");
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // join the room
    if (user) {
      socket.emit("join-room", user._id);
      socket.emit("came-online", user._id);

      socket.on("online-users-updated", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [user]);

  return (
    <>
      <div className="flex gap-5">
        {/* 1st part   user search , userslist/chatlist */}
        <div className="w-96">
          <UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
          <UsersList
            searchKey={searchKey}
            socket={socket}
            onlineUsers={onlineUsers}
            setSearchKey={setSearchKey}
          />
        </div>
        {/* 2nd part   chatbox */}
        {selectedChat && (
          <div className="w-full">
            <ChatArea socket={socket} />
          </div>
        )}
        {!selectedChat && (
          <div className="w-full h-[80vh]  items-center justify-center flex bg-white flex-col">
            <img
              src="https://static.vecteezy.com/system/resources/previews/009/992/540/original/speech-bubble-chat-icon-sign-design-free-png.png"
              alt=""
              className="w-128 h-80"
            />
            <div className="text-3xl font-semibold text-gray-500 mt-3">
              Connect and Chat with ChatLink
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
