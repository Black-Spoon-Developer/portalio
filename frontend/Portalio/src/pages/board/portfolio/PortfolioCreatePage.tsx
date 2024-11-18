import React, { useRef, useEffect, useState } from "react";
import { createPortfolio } from "../../../api/PortfolioAPI";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { mainCategories, subCategories } from "../../../assets/JobCategory";
import { ToastContainer, toast } from "react-toastify";
import { userTicketUpdate } from "../../../api/TicketAPI";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { templates } from "./PortfolioData";
import Modal from "./Modal";

const PortfolioCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const editorRef = useRef<Editor>(null);
  const defaultImg =
    "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img2.png";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(defaultImg); // 썸네일 URL 저장
  const [isPublished, setIsPublished] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const BASE_URL = "https://k11d202.p.ssafy.io";
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const openModal = (template: string) => {
    setSelectedTemplate(template);
    setIsModalOpen2(true);
  };

  const closeModal = () => {
    setIsModalOpen2(false);
    setSelectedTemplate(null);
  };

  const confirmInsertTemplate = () => {
    if (selectedTemplate && editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setMarkdown(selectedTemplate); // 선택한 템플릿 삽입
    }
    closeModal();
  };

  const notifyfail = () => {
    toast.error("게시글 내용이 부족합니다.");
  };

  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      console.log("Editor initialized:", editorInstance);
    }
  }, []);

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
      console.log("Response Text:", imageUrl);
      callback(imageUrl, "이미지 설명");
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      const markdownContent = editorInstance.getMarkdown();
      setContent(markdownContent); // content 상태에 저장
      setIsModalOpen(true);
    }
  };

  const handleThumbnailChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setThumbnail(file);

      // S3로 업로드하고 URL 응답받기
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
        setThumbnailUrl(response.data); // URL 상태에 저장
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

  // 썸네일과 소개 글까지 작성을 다 한 후에 저장하는 함수
  const handleModalSave = async () => {
    if (!title || !content || !selectedSubCategory) {
      notifyfail();
      alert("제목, 내용, 직무 정보를 모두 입력해 주세요!");
      return;
    }

    const portfolioData = {
      portfolioTitle: title,
      portfolioDescription: description,
      portfolioContent: content,
      portfolioThumbnailImg: thumbnailUrl,
      portfolioPost: isPublished,
      jobSubCategoryId: selectedSubCategory, // 예시 값으로 설정. 실제 값은 필요에 따라 설정
    };

    // 저장 요청
    const response = await createPortfolio(portfolioData);

    // 저장 요청 후 티켓 값 1 증가
    await userTicketUpdate(1);

    // 저장 후 포트폴리오 게시판으로 이동
    navigate(`/portfolio/${response.portfolioId}`);
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
        <div className="flex mb-5 mt-10">
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
              <div className="button-group">
                초안 설정하기 : 
                <button
                  onClick={() => openModal(templates.portfolioMarkdown)}
                  className="m-3 px-3 p-2 text-lg font-semibold rounded-lg bg-green-500 text-white hover:bg-green-600"
                >
                  포트폴리오
                </button>
                <button
                  onClick={() => openModal(templates.careerMarkdown)}
                  className="m-3 px-3 p-2 text-lg font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  경력기술서
                </button>
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
          initialValue={templates.defaultMarkdown}
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
        <Modal
          isOpen={isModalOpen2}
          onClose={closeModal}
          onConfirm={confirmInsertTemplate}
          message="이 버튼을 누르면 내용이 초기화됩니다. 계속하시겠습니까?"
      />
      
    </div>
  );
};

export default PortfolioCreatePage;
