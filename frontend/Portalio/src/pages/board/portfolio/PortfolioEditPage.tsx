import React, { useRef, useEffect, useState } from "react";
import {
  patchPortfolio,
  fetchPortfolioDetail,
} from "../../../api/PortfolioAPI";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { PortfolioRequest } from "../../../type/PortfolioType";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { mainCategories, subCategories } from "../../../assets/JobCategory";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PortfolioEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { portfolio_id } = useParams<{ portfolio_id: string }>();
  const editorRef = useRef<Editor>(null);
  const defaultImg =
    "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img2.png";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [_, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(defaultImg);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [description, setDescription] = useState("");

  const BASE_URL = "https://k11d202.p.ssafy.io";
  // const BASE_URL = "http://localhost:8080/";

  const notifyfail = () => {
    toast.error("게시글 내용이 부족합니다.");
  };

  useEffect(() => {
    // 포트폴리오 데이터 불러오기
    const fetchPortfolioData = async () => {
      if (portfolio_id) {
        try {
          const response = await fetchPortfolioDetail(portfolio_id); // API 호출
          const data: PortfolioRequest = response; // response의 data를 PortfolioResponse로 타입 지정

          setTitle(data.portfolioTitle);
          setContent(data.portfolioContent);
          setThumbnailUrl(data.portfolioThumbnailImg || defaultImg);
          setIsPublished(data.portfolioPost);

          if (editorRef.current) {
            editorRef.current.getInstance().setMarkdown(data.portfolioContent);
          }
        } catch (error) {
          console.error("포트폴리오 데이터 불러오기 오류:", error);
        }
      }
    };
    fetchPortfolioData();
  }, [portfolio_id]);

  const onUploadImage = async (
    blob: Blob,
    callback: (url: string, alt: string) => void
  ) => {
    try {
      const formData = new FormData();
      formData.append("multipartFile", blob);
      formData.append("folderName", "Portfolio_board");

      const response = await axios.post(
        `${BASE_URL}/api/v1/s3/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data;
      callback(imageUrl, "이미지 설명");
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      const markdownContent = editorInstance.getMarkdown();
      setContent(markdownContent);
      setIsModalOpen(true);
    }
  };

  const handleThumbnailChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setThumbnail(file);

      const formData = new FormData();
      formData.append("multipartFile", file);
      formData.append("folderName", "Portfolio_board");

      try {
        const response = await axios.post(
          `${BASE_URL}/api/v1/s3/image`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setThumbnailUrl(response.data);
      } catch (error) {
        console.error("썸네일 업로드 오류:", error);
      }
    }
  };

  const openFileExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setThumbnail(null);
    setThumbnailUrl(defaultImg);
    setIsPublished(false);
  };

  const handlePublishToggle = () => {
    setIsPublished((prev) => !prev);
  };

  const handleModalSave = async () => {
    if (!title || !content) {
      notifyfail();
      return;
    }

    const portfolioData: PortfolioRequest = {
      portfolioTitle: title,
      portfolioDescription: description,
      portfolioContent: content,
      portfolioThumbnailImg: thumbnailUrl,
      portfolioPost: isPublished,
      jobSubCategoryId: selectedSubCategory,
    };

    if (portfolio_id) {
      await patchPortfolio(portfolio_id, portfolioData);
      // 상세 페이지로 이동
      navigate(`/portfolio/${portfolio_id}`);
    }
  };

  const [selectedMainCategory, setSelectedMainCategory] = useState<
    number | null
  >(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(
    null
  );

  const handleMainCategoryChange = (event: SelectChangeEvent<number>) => {
    const mainCategoryId = Number(event.target.value);
    setSelectedMainCategory(mainCategoryId);
    setSelectedSubCategory(null); // 메인 카테고리가 변경될 때 서브 카테고리 초기화
  };

  const handleSubCategoryChange = (event: SelectChangeEvent<number>) => {
    setSelectedSubCategory(Number(event.target.value));
  };

  const filteredSubCategories = subCategories.filter(
    (subCategory) => subCategory.parentId === selectedMainCategory
  );

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  return (
    <div>
        <div className="flex mb-5 mt-10 min-h-screen">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className="w-full p-3 text-4xl rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="p-4">
          <Accordion>
            <AccordionDetails>
              <div className="mb-4">
                <Select
                  value={selectedMainCategory || ""}
                  onChange={handleMainCategoryChange}
                  displayEmpty
                  className="w-full"
                >
                  <MenuItem value="" disabled>
                    중분류 선택
                  </MenuItem>
                  {mainCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              {selectedMainCategory && (
                <div className="mb-4">
                  <Select
                    value={selectedSubCategory || ""}
                    onChange={handleSubCategoryChange}
                    displayEmpty
                    className="w-full"
                  >
                    <MenuItem value="" disabled>
                      소분류 선택
                    </MenuItem>
                    {filteredSubCategories.map((subCategory) => (
                      <MenuItem key={subCategory.id} value={subCategory.id}>
                        {subCategory.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              )}
              <div>
              <button
                  onClick={() => window.open("/markdown-guide", "_blank", "width=800,height=600")}
                  className="m-3 px-3 p-2 text-lg font-semibold rounded-lg bg-gray-500 text-white hover:bg-gray-600"
                >
                  MarkDown 사용법
                </button>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>

        <Editor
          ref={editorRef}
          initialValue="Hello, Toast UI Editor with Plugins!"
          previewStyle="vertical"
          height="1000px"
          initialEditType="markdown"
          useCommandShortcut={true}
          hooks={{
            addImageBlobHook: onUploadImage,
          }}
        />

        <button
          onClick={handleSave}
          className="my-3 px-3 py-2 text-lg font-semibold rounded-lg bg-conceptSkyBlue text-white hover:bg-hoverConceptSkyBlue"
        >
          저장
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg w-1/3">
              <h2 className="text-xl font-semibold mb-3">게시 설정</h2>

              <div className="mb-3">
                <div
                  onClick={openFileExplorer}
                  className="w-[200px] h-[200px] bg-gray-300 flex items-center justify-center cursor-pointer rounded"
                >
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <p className="text-gray-500">
                      클릭하여 이미지를 선택하세요
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </div>
              <div>
                <textarea
                  id="textArea"
                  value={description}
                  onChange={handleChange}
                  rows={5}
                  cols={40}
                  placeholder="당신의 포스트를 짧게 소개해보세요."
                  className="w-full max-w-lg p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-700">게시 여부</label>
                <button
                  onClick={handlePublishToggle}
                  className={`mt-2 px-3 py-1 rounded ${
                    isPublished ? "bg-blue-300" : "bg-red-300"
                  }`}
                >
                  {isPublished ? "Public" : "Private"}
                </button>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  취소
                </button>
                <button
                  onClick={handleModalSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  작성
                </button>
                <ToastContainer />
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default PortfolioEditPage;
