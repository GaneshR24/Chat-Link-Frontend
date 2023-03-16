import React from "react";
import { FaSearch } from "react-icons/fa";

const UserSearch = ({ searchKey, setSearchKey }) => {
  return (
    <>
      <div className="relative">
        <input
          className="rounded-xl w-full border-gray-300 pl-10 text-gray-500 h-14"
          type="text"
          placeholder="Search friends"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <FaSearch className="absolute top-5 left-4 text-gray-500" />
      </div>
    </>
  );
};

export default UserSearch;
