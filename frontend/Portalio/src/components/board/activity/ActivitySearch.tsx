import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

interface ActivitySearchProps {
  onSearch: (term: string) => void;
  onReset: () => void;
}

const ActivitySearch: React.FC<ActivitySearchProps> = ({
  onSearch,
  onReset,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() !== "") {
      onSearch(searchTerm.trim());
    } else {
      onReset();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="flex items-center border-2 rounded-full my-4 p-2">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="검색어를 입력하세요."
        className="flex-grow outline-none pl-4"
      />
      <button onClick={handleSearchClick} className="flex items-center p-2">
        <IoSearchSharp className="size-6" />
      </button>
    </div>
  );
};

export default ActivitySearch;
