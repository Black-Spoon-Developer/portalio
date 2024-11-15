import React, { useState } from "react";
import SettingsIcon from "../../assets/Setting.svg";
import FacebookIcon from "../../assets/Facebook.svg";
import LinkedInIcon from "../../assets/LinkedIn.svg";
import InstagramIcon from "../../assets/Instagram.svg";
import GitHubIcon from "../../assets/GitHub.svg";

const SocialLink: React.FC = () => {
  // 소셜 관련 변수
  const [isEditing, setIsEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    linkedin: "",
    instagram: "",
    github: "",
  });

  // 소셜 관련 함수
  const handleSocialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks((prevLinks) => ({ ...prevLinks, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // 여기서 서버로 socialLinks를 저장하는 API 호출 추가 가능
    console.log("Social Links Saved:", socialLinks);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="w-1/2 pl-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">소셜</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded p-1 transition duration-200"
          >
            <img
              src={SettingsIcon}
              alt="소셜 설정 아이콘"
              className="size-4 mr-1"
            />
            소셜 링크 수정
          </button>
        )}
      </div>
      <ul className={`social-list ${isEditing ? "space-y-4" : "space-y-6"}`}>
        <li className="flex items-center space-x-2">
          <img src={FacebookIcon} alt="Facebook" className="w-8 h-8" />
          {isEditing ? (
            <input
              type="text"
              name="facebook"
              value={socialLinks.facebook}
              onChange={handleSocialInputChange}
              placeholder="Facebook 링크"
              className="border p-2 rounded w-full"
            />
          ) : (
            <a
              href={socialLinks.facebook}
              className="text-blue-800 hover:underline"
            >
              Facebook 링크
            </a>
          )}
        </li>
        <li className="flex items-center space-x-2">
          <img src={LinkedInIcon} alt="LinkedIn" className="w-8 h-8" />
          {isEditing ? (
            <input
              type="text"
              name="linkedin"
              value={socialLinks.linkedin}
              onChange={handleSocialInputChange}
              placeholder="LinkedIn 링크"
              className="border p-2 rounded w-full"
            />
          ) : (
            <a
              href={socialLinks.linkedin}
              className="text-blue-800 hover:underline"
            >
              LinkedIn 링크
            </a>
          )}
        </li>
        <li className="flex items-center space-x-2">
          <img src={InstagramIcon} alt="Instagram" className="w-8 h-8" />
          {isEditing ? (
            <input
              type="text"
              name="instagram"
              value={socialLinks.instagram}
              onChange={handleSocialInputChange}
              placeholder="Instagram 링크"
              className="border p-2 rounded w-full"
            />
          ) : (
            <a
              href={socialLinks.instagram}
              className="text-blue-800 hover:underline"
            >
              Instagram 링크
            </a>
          )}
        </li>
        <li className="flex items-center space-x-2">
          <img src={GitHubIcon} alt="GitHub" className="w-8 h-8" />
          {isEditing ? (
            <input
              type="text"
              name="github"
              value={socialLinks.github}
              onChange={handleSocialInputChange}
              placeholder="GitHub 링크"
              className="border p-2 rounded w-full"
            />
          ) : (
            <a
              href={socialLinks.github}
              className="text-blue-800 hover:underline"
            >
              GitHub 링크
            </a>
          )}
        </li>
      </ul>
      {isEditing && (
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleSave}
            className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
          >
            저장
          </button>
          <button
            onClick={handleCancel}
            className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialLink;
