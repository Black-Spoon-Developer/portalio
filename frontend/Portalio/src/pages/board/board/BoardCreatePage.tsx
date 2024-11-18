import React, { useRef, useEffect, useState } from "react";
import { createBoard } from "../../../api/BoardAPI";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Categories } from "../../../assets/JobCategory";
import { ToastContainer, toast } from "react-toastify";
import { userTicketUpdate } from "../../../api/TicketAPI";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { templates } from "../portfolio/PortfolioData";

const BoardCreatePage: React.FC = () => {
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
  const [board, setBoard] = useState("");
  const BASE_URL = "https://k11d202.p.ssafy.io";

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
      formData.append("folderName", board);

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
      formData.append("folderName", board);

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

  /// 모든 값을 입력 후 최종으로 글 작성하는 핸들러 함수
  const handleModalSave = async () => {
    if (!title || !content) {
      notifyfail();

      return;
    }

    const boardData = {
      boardCategory: board,
      boardTitle: title,
      boardContent: content,
      boardSolve: isPublished,
      boardThumbnailImg: thumbnailUrl,
    };

    // 작성 글 저장
    const response = await createBoard(boardData);

    // 작성 글 저장 후 티켓 1 증가
    await userTicketUpdate(1);

    // 티켓 증가 후 카테고리에 따라서 이동을 다르게 리다이렉트 시켜주기
    if (response.boardCategory === "FREE") {
      navigate(`/free/${response.boardId}`);
    } else {
      navigate(`/question/${response.boardId}`);
    }
  };

  const handleMainCategoryChange = (event: SelectChangeEvent) => {
    const selectedBoardValue = event.target.value;
    setBoard(selectedBoardValue); // 선택한 게시판의 value를 설정
  };

  return (
    <div className="min-h-screen">
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
                  value={board || ""}
                  onChange={handleMainCategoryChange}
                  displayEmpty
                  className="w-full"
                >
                  <MenuItem value="" disabled>
                    게시판 선택
                  </MenuItem>
                  {Categories.map((category) => (
                    <MenuItem key={category.id} value={category.value}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
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
              <h2 className="text-xl font-semibold mb-3">썸네일 설정</h2>

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

export default BoardCreatePage;
