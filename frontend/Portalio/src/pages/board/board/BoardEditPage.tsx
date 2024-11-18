import React, { useRef, useEffect, useState } from "react";
import { getBoard, patchBoard } from "../../../api/BoardAPI";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BoardRequest } from "../../../type/BoardType";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BoardEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { board_id } = useParams<{ board_id: string }>();
  const editorRef = useRef<Editor>(null);
  const defaultImg =
    "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img2.png";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(defaultImg); // 썸네일 URL 저장
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [solve, setSolve] = useState(false);
  const BASE_URL = "https://k11d202.p.ssafy.io";

  const notifyfail = () => {
    toast.error("게시글 내용이 부족합니다.");
  };

  useEffect(() => {
    // 포트폴리오 데이터 불러오기
    const fetchBoardDeta = async () => {
      if (board_id) {
        try {
          const response = await getBoard(board_id); // API 호출
          const data: BoardRequest = response.data; // response의 data를 PortfolioResponse로 타입 지정

          setCategory(data.boardCategory);
          setTitle(data.boardTitle);
          setContent(data.boardContent);
          setSolve(data.boardSolve);
          setThumbnailUrl(data.boardThumbnailImg || defaultImg);
          if (editorRef.current) {
            editorRef.current.getInstance().setMarkdown(data.boardContent);
          }
        } catch (error) {
          console.error("포트폴리오 데이터 불러오기 오류:", error);
        }
      }
    };
    fetchBoardDeta();
  }, [board_id]);

  const onUploadImage = async (
    blob: Blob,
    callback: (url: string, alt: string) => void
  ) => {
    try {
      const formData = new FormData();
      formData.append("multipartFile", blob);
      formData.append("folderName", category);

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
      formData.append("folderName", category);

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
  };

  const handleModalSave = async () => {
    if (!title || !content) {
      notifyfail();

      return;
    }

    const boardData = {
      boardCategory: category,
      boardTitle: title,
      boardContent: content,
      boardSolve: solve,
      boardThumbnailImg: thumbnailUrl,
    };
    if (board_id) {
      patchBoard(board_id, boardData);
      // 카테고리에 따라 상세 페이지로 이동
      if (category === "FREE") {
        navigate(`/free/${board_id}`);
      } else {
        navigate(`/question/${board_id}`);
      }
    }
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
        <div>
          <button
            onClick={() => window.open("/markdown-guide", "_blank", "width=800,height=600")}
            className="m-3 px-3 p-2 text-lg font-semibold rounded-lg bg-gray-500 text-white hover:bg-gray-600"
          >
            MarkDown 사용법
          </button>
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
                  수정
                </button>
                <ToastContainer />
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default BoardEditPage;
