import React, { useRef, useEffect, useState } from 'react';
import { createBoard } from "../../../api/BoardAPI"
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Categories } from "../../../assets/JobCategory";

const BoardCreatePage: React.FC = () => {
  const editorRef = useRef<Editor>(null);
  const defaultImg = "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img2.png";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(defaultImg); // 썸네일 URL 저장
  const [isPublished, setIsPublished] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [board, setBoard] = useState("")
  const BASE_URL = "https://k11d202.p.ssafy.io";

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
  
      const response = await axios.post(`${BASE_URL}/api/v1/s3/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
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

  const handleThumbnailChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setThumbnail(file);

      // S3로 업로드하고 URL 응답받기
      const formData = new FormData();
      formData.append("multipartFile", file);
      formData.append("folderName", board);

      try {
        const response = await axios.post(`${BASE_URL}/api/v1/s3/image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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

  const handleModalSave = async () => {
    if (!title || !content) {
      console.error("모든 필드가 입력되어야 합니다.");
      
      return;
    }
    
    const boardData = {
      boardCategory: board,
      boardTitle: title,
      boardContent: content,
      boardSolve: false,
      boardThumbnailImg: thumbnailUrl,
    };

    createBoard(boardData) 
  };

  const handleMainCategoryChange = (event: SelectChangeEvent) => {
    const selectedBoardValue = event.target.value;
    setBoard(selectedBoardValue); // 선택한 게시판의 value를 설정
  };

  return (
    <div>
      <div className="flex mb-5">
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
          addImageBlobHook: onUploadImage
        }}
      />

      <button 
        onClick={handleSave} 
        className="mt-5 px-5 py-3 text-lg font-semibold rounded-lg"
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
                  <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover rounded" />
                ) : (
                  <p className="text-gray-500">클릭하여 이미지를 선택하세요</p>
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
              <button onClick={handleModalClose} className="px-4 py-2 bg-gray-300 rounded-lg">취소</button>
              <button onClick={handleModalSave} className="px-4 py-2 bg-blue-500 text-white rounded-lg">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardCreatePage;
