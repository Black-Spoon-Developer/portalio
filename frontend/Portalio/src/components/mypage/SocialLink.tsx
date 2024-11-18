import React, { useEffect, useState } from "react";
import SettingsIcon from "../../assets/Setting.svg";
import FacebookIcon from "../../assets/Facebook.svg";
import LinkedInIcon from "../../assets/LinkedIn.svg";
import InstagramIcon from "../../assets/Instagram.svg";
import GitHubIcon from "../../assets/GitHub.svg";
import { createOrUpdateSocialLink, getSocialLink } from "../../api/MyPageAPI";
import { UserSocialLinkRequest } from "../../interface/mypage/MyPageInterface";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

const SocialLink: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  // 설정 버튼 제어 변수
  const memberUsername = useSelector((state: RootState) => state.auth.memberUsername);
  const isOwner = memberUsername && username ? memberUsername === username : false;

  // 소셜 관련 변수
  const [isEditing, setIsEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState<UserSocialLinkRequest>({
    facebook: "",
    linkedin: "",
    instagram: "",
    github: "",
  });

  // 입력 필드 포커스가 벗어날 때 호출되는 함수
  const handleSocialInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let updatedValue = value.trim();

    // 프로토콜이 없는 경우 'https://' 추가
    if (updatedValue && !/^https?:\/\//i.test(updatedValue)) {
      updatedValue = `https://${updatedValue}`;
      setSocialLinks((prevLinks) => ({ ...prevLinks, [name]: updatedValue }));
    }
  };

  // 소셜 바인딩 핸들러 함수
  const handleSocialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks((prevLinks) => ({ ...prevLinks, [name]: value }));
  };

  const handleGetSociallink = async (username: string) => {
    const response = await getSocialLink(username);
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
    handleGetSociallink(username || '');
  }, []);

  return (
    <div className="w-1/2 pl-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">소셜</h3>
        {isOwner && !isEditing && (
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
          {/* facebook */}
          <a
            href={socialLinks.facebook} // 이동할 링크
            target="_blank" // 새로운 탭에서 열기
            rel="noopener noreferrer" // 보안을 위해 사용
          >
            <img src={FacebookIcon} alt="Facebook" className="w-8 h-8" />
          </a>

          {isEditing ? (
            <input
              type="text"
              name="facebook"
              value={socialLinks.facebook} // 입력값을 연결할 변수
              onBlur={handleSocialInputBlur} // url 프로토콜 자동 추가 함수
              onChange={handleSocialInputChange} // 입력 값 처리 함수
              placeholder="Facebook 링크"
              className="border p-2 rounded w-full"
            />
          ) : (
            <a
              href={socialLinks.facebook} // 이동할 링크
              target="_blank" // 새로운 탭에서 열기
              rel="noopener noreferrer" // 보안을 위해 사용
              className="text-blue-800 hover:underline"
            >
              Facebook
            </a>
          )}
        </li>

        {/* LinkedIn */}
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
              onBlur={handleSocialInputBlur}
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

        {/* Instagram */}
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
              onBlur={handleSocialInputBlur}
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

        {/* GitHub */}
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
              onBlur={handleSocialInputBlur}
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
