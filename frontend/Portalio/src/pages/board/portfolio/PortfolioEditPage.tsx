import React, { useRef, useEffect, useState } from 'react';
import { patchPortfolio, fetchPortfolioDetail } from "../../../api/PortfolioAPI"
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PortfolioEditPage: React.FC = () => {

  const { portfolio_id } = useParams<{ portfolio_id: string }>();
  const editorRef = useRef<Editor>(null);
  const defaultImg = "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img2.png";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(defaultImg); // 썸네일 URL 저장
  const [isPublished, setIsPublished] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      console.log("Editor initialized:", editorInstance);
    }
  }, []);
  
  useEffect(() => {
    // 포트폴리오 데이터 불러오기
    const fetchPortfolioData = async () => {
      console.log(portfolio_id)
      if (portfolio_id) {
        console.log('b')
        try {
          const data = await fetchPortfolioDetail(portfolio_id); // 데이터 fetch 호출
          setTitle(data.portfolioTitle);
          console.log(data.portfolioTitle)
          setContent(data.portfolioContent);
          setThumbnailUrl(data.portfolioThumbnailImg || defaultImg);
          setIsPublished(data.portfolioPost);

          if (editorRef.current) {
            editorRef.current.getInstance().setMarkdown(data.portfolioContent); // 에디터 초기화
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
  
      const response = await axios.post("http://localhost:8080/s3/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
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
      formData.append("folderName", "Portfolio_board");

      try {
        const response = await axios.post("http://localhost:8080/s3/image", formData, {
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

  const handlePublishToggle = () => {
    setIsPublished((prev) => !prev);
  };

  const handleModalSave = async () => {
    if (!title || !content) {
      console.error("모든 필드가 입력되어야 합니다.");
      
      return;
    }
    
    const portfolioData = {
      portfolioTitle: title,
      portfolioContent: content,
      portfolioThumbnailImg: thumbnailUrl,
      portfolioPost: isPublished,
      jobSubCategoryId: 1, // 예시 값으로 설정. 실제 값은 필요에 따라 설정
    };

    if (portfolio_id) {
      patchPortfolio(portfolio_id, portfolioData) 
    }
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
            <h2 className="text-xl font-semibold mb-3">게시 설정</h2>
            
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

            <div className="mb-5">
              <label className="block text-gray-700">게시 여부</label>
              <button 
                onClick={handlePublishToggle}
                className={`mt-2 px-3 py-1 rounded ${isPublished ? 'bg-blue-300' : 'bg-red-300'}`}
              >
                {isPublished ? 'Public' : 'Private'}
              </button>
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

export default PortfolioEditPage;
