import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createRepository } from "../../../api/RepositoryAPI";
import '@toast-ui/editor/dist/toastui-editor.css';
import { useDropzone } from 'react-dropzone';
import { uploadFilesAsZip } from '../../../api/S3ImageUploadAPI'
import { FaFilePdf, FaFileImage, FaFileVideo, FaFileAudio, FaFile } from 'react-icons/fa'; // 아이콘 추가
import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';
import TextField from "@mui/material/TextField";

const RepositoryCreatePage: React.FC = () => {
  const editorRef = useRef<Editor>(null);
  const defaultImg = "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img2.png";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(defaultImg);
  const [isPublished, setIsPublished] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [fileKey, setFileKey] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedZipUrl, setUploadedZipUrl] = useState<string | null>(null);
  const BASE_URL = "https://k11d202.p.ssafy.io";

  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      console.log("Editor initialized:", editorInstance);
    }
  }, []);

  const onUploadImage = async (blob: Blob, callback: (url: string, alt: string) => void) => {
    try {
      const formData = new FormData();
      formData.append("multipartFile", blob);
      formData.append("folderName", "Repository");

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
      setContent(markdownContent);
      setIsModalOpen(true);
    }
  };

  
  const handlePublishToggle = () => {
    setIsPublished((prev) => !prev);
  };

  const handleThumbnailChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setThumbnail(file);

      const formData = new FormData();
      formData.append("multipartFile", file);
      formData.append("folderName", "Repository");

      try {
        const response = await axios.post(`${BASE_URL}/api/v1/s3/image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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
    setThumbnailUrl(defaultImg);
    setIsPublished(false);
  };

  const handleModalSave = async () => {
    if (!title || !content || !startDate || !endDate) {
      console.error("모든 필드가 입력되어야 합니다.");
      return;
    }
    
    const repositoryData = {
      repositoryTitle: title,
      repositoryContent: content,
      startDate: startDate,
      endDate: endDate,
      repositoryFileKey: fileKey,
      repositoryPost: isPublished
    };
    console.log(repositoryData)

    createRepository(repositoryData); 
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
      if (files.length === 0) return;
  
      // ZIP 파일로 업로드
      const folderName = "Repository"; // 업로드할 폴더 이름
      const zipUrl = await uploadFilesAsZip(files, folderName);
  
      if (zipUrl) {
        setUploadedZipUrl(zipUrl);
        console.log(`업로드된 ZIP 파일 URL: ${zipUrl}`);
      } else {
        console.error("ZIP 파일 업로드 실패");
      }
  
      // 업로드 완료 후 파일 목록 초기화
      setFiles([]);
    };
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  
    // 확장자에 따른 아이콘 선택 함수
    const getFileIcon = (fileName: string) => {
      const extension = fileName.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'pdf':
          return <FaFilePdf style={{ color: 'red' }} />;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return <FaFileImage style={{ color: 'green' }} />;
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'wmv':
          return <FaFileVideo style={{ color: 'blue' }} />;
        case 'mp3':
        case 'wav':
        case 'flac':
          return <FaFileAudio style={{ color: 'purple' }} />;
        default:
          return <FaFile style={{ color: 'gray' }} />;
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
        initialValue="Hello, Toast UI Editor with Plugins!"
        previewStyle="vertical"
        height="1000px"
        initialEditType="markdown"
        useCommandShortcut={true}
        hooks={{
          addImageBlobHook: onUploadImage
        }}
      />

<div style={{ display: 'grid', gridTemplateColumns: '2fr 8fr 2fr', gap: '10px', alignItems: 'center' }}>
      {/* 왼쪽 빈 공간 */}
      <div></div>

      {/* 드래그 앤 드롭 영역 */}
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #007bff',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          color: isDragActive ? '#0056b3' : '#007bff',
        }}
      >
        <input {...getInputProps()} />
        {files.length > 0 ? (
          <ul
            style={{
              listStyleType: 'none',
              padding: 0,
              maxHeight: '150px', // 최대 높이 설정
              overflowY: 'auto', // 세로 스크롤 활성화
            }}
          >
            {files.map((file, index) => (
              <li
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 8fr 1fr',
                  alignItems: 'center',
                  marginBottom: '5px',
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
                    color: 'red',
                    fontWeight: 'bold',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                  }}
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>{isDragActive ? '파일을 여기에 놓으세요' : '파일을 드래그하거나 클릭하여 추가하세요'}</p>
        )}
      </div>

      {/* 오른쪽 빈 공간 */}
      <div></div>

      {/* 업로드된 ZIP 파일 URL */}
      {uploadedZipUrl && (
        <div className="mt-3" style={{ gridColumn: '2 / 3' }}>
          <p>업로드된 ZIP 파일:</p>
          <a href={uploadedZipUrl} target="_blank" rel="noopener noreferrer">
            {uploadedZipUrl}
          </a>
        </div>
      )}

      {/* 업로드 버튼 */}
      <button onClick={handleUpload} disabled={files.length === 0} className="mt-3" style={{ gridColumn: '2 / 3' }}>
        ZIP 파일로 업로드
      </button>
      </div>
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

export default RepositoryCreatePage;
