import React, { useEffect, useState } from "react";
import SettingsIcon from "../../assets/Setting.svg";
import FacebookIcon from "../../assets/Facebook.svg";
import LinkedInIcon from "../../assets/LinkedIn.svg";
import InstagramIcon from "../../assets/Instagram.svg";
import GitHubIcon from "../../assets/GitHub.svg";
import { createOrUpdateSocialLink, getSocialLink } from "../../api/MyPageAPI";
import { UserSocialLinkRequest } from "../../interface/mypage/MyPageInterface";
import { useParams } from "react-router-dom";

const SocialLink: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const userId = Number(user_id);

  // 소셜 관련 변수
  const [isEditing, setIsEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState<UserSocialLinkRequest>({
    facebook: "",
    linkedin: "",
    instagram: "",
    github: "",
  });

  // 소셜 바인딩 핸들러 함수
  const handleSocialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks((prevLinks) => ({ ...prevLinks, [name]: value }));
  };

  const handleGetSociallink = async (memberId: number) => {
    const response = await getSocialLink(memberId);
    setSocialLinks(response);
  };

  // 소셜 저장 함수
  const handleSaveSocialLink = async () => {
    const response = await createOrUpdateSocialLink(socialLinks);
    setSocialLinks(response);
    setIsEditing(false);
  };

  // 변경 취소 핸들러 함수
  const handleCancel = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    handleGetSociallink(userId);
  }, []);

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
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={FacebookIcon} alt="Facebook" className="w-8 h-8" />
          </a>

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
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:underline"
            >
              Facebook
            </a>
          )}
        </li>
        <li className="flex items-center space-x-2">
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={LinkedInIcon} alt="LinkedIn" className="w-8 h-8" />
          </a>

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
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:underline"
            >
              LinkedIn
            </a>
          )}
        </li>
        <li className="flex items-center space-x-2">
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={InstagramIcon} alt="Instagram" className="w-8 h-8" />
          </a>

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
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:underline"
            >
              Instagram
            </a>
          )}
        </li>
        <li className="flex items-center space-x-2">
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={GitHubIcon} alt="GitHub" className="w-8 h-8" />
          </a>

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
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:underline"
            >
              GitHub
            </a>
          )}
        </li>
      </ul>
      {isEditing && (
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleSaveSocialLink}
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
