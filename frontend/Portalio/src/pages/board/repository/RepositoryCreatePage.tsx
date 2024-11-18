import React, { useRef, useEffect, useState, useCallback } from "react";
import { createRepository } from "../../../api/RepositoryAPI";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useDropzone } from "react-dropzone";
import { uploadFilesToS3AndSaveToMongo } from "../../../api/S3ImageUploadAPI";
import {
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFile,
} from "react-icons/fa"; // 아이콘 추가
import { Editor } from "@toast-ui/react-editor";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { userTicketUpdate } from "../../../api/TicketAPI";
import "react-toastify/dist/ReactToastify.css";
import { templates } from "../portfolio/PortfolioData";


const RepositoryCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const editorRef = useRef<Editor>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [mongoDocumentId, setMongoDocumentId] = useState<string>(""); // MongoDB 문서 ID 상태
  const [description, setDescription] = useState("");
  const BASE_URL = "https://k11d202.p.ssafy.io";
  // const BASE_URL = "http://localhost:8080";

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
      formData.append("folderName", "Repository");

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
      setContent(markdownContent);
      setIsModalOpen(true);
    }
  };

  const handlePublishToggle = () => {
    setIsPublished((prev) => !prev);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsPublished(false);
  };

  // 모든 값을 입력 후 최종으로 글 작성하는 핸들러 함수
  const handleModalSave = async () => {
    if (!title || !content || !startDate || !endDate) {
      notifyfail();
      return;
    }

    const repositoryData = {
      repositoryTitle: title,
      repositoryDescription: description,
      repositoryContent: content,
      startDate: startDate,
      endDate: endDate,
      repositoryFileKey: mongoDocumentId,
      repositoryPost: isPublished,
    };

    // 레포지토리 저장
    const response = await createRepository(repositoryData);

    // 저장 후 티켓 값 1 증가
    await userTicketUpdate(1);

    // 티켓 업데이트 후 이동
    navigate(`/repository/${response.repositoryId}`);
  };

  // 파일이 드롭되거나 파일 탐색기로 선택되었을 때 실행될 콜백
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  // 특정 파일을 목록에서 제거하는 함수
  const removeFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  // 업로드 버튼 클릭 시 실행되는 함수
  const handleUpload = async () => {
    const documentId = await uploadFilesToS3AndSaveToMongo(files);
    if (documentId) {
      console.log(`MongoDB에 저장된 문서 ID: ${documentId}`);
      setMongoDocumentId(documentId);
      notify();
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // 확장자에 따른 아이콘 선택 함수
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FaFilePdf style={{ color: "red" }} />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaFileImage style={{ color: "green" }} />;
      case "mp4":
      case "avi":
      case "mov":
      case "wmv":
        return <FaFileVideo style={{ color: "blue" }} />;
      case "mp3":
      case "wav":
      case "flac":
        return <FaFileAudio style={{ color: "purple" }} />;
      default:
        return <FaFile style={{ color: "gray" }} />;
    }
  };

  const notify = () => {
    toast.success("파일 업로드 성공!");
  };

  const notifyfail = () => {
    toast.error("게시글 내용이 부족합니다.");
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
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

      <div>
        <button
          onClick={() => window.open("/markdown-guide", "_blank", "width=800,height=600")}
          className="m-3 px-3 p-2 text-lg font-semibold rounded-lg bg-gray-500 text-white hover:bg-gray-600"
        >
          MarkDown 사용법
        </button>
      </div>
      {/* 시작 날짜와 종료 날짜 입력 */}
      <div className="flex mb-5 space-x-4">
        <TextField
          label="시작 날짜"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="종료 날짜"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 8fr 2fr",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {/* 왼쪽 빈 공간 */}
        <div></div>

        {/* 드래그 앤 드롭 영역 */}
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed #007bff",
            borderRadius: "8px",
            padding: "20px",
            margin: "20px",
            textAlign: "center",
            cursor: "pointer",
            color: isDragActive ? "#0056b3" : "#007bff",
          }}
        >
          <input {...getInputProps()} />
          {files.length > 0 ? (
            <ul
              style={{
                listStyleType: "none",
                padding: 0,
                maxHeight: "150px", // 최대 높이 설정
                overflowY: "auto", // 세로 스크롤 활성화
              }}
            >
              {files.map((file, index) => (
                <li
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 8fr 1fr",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <span>{getFileIcon(file.name)}</span>
                  <span>{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering dropzone
                      removeFile(file);
                    }}
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                    }}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              {isDragActive
                ? "파일을 여기에 놓으세요"
                : "파일을 드래그하거나 클릭하여 추가하세요"}
            </p>
          )}
        </div>

        {/* 오른쪽 빈 공간 */}
        <div></div>

        {/* 업로드 버튼 */}
        <button
          onClick={handleUpload}
          disabled={files.length === 0}
          className="mt-3"
          style={{ gridColumn: "2 / 3" }}
        >
          파일 업로드
        </button>
        <ToastContainer />
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-5"
      >
        저장
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg w-1/3">
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
                저장
              </button>
            </div>
          </div>
        </div>
        )}
    </div>
  );
};

export default RepositoryCreatePage;
