import React, { useRef, useEffect, useState, useCallback } from 'react';
import { getRepositoryDetail, patchRepository } from "../../../api/RepositoryAPI";
import '@toast-ui/editor/dist/toastui-editor.css';
import { useDropzone } from 'react-dropzone';
import { getmyfiles, repoupdate } from '../../../api/S3ImageUploadAPI'
import { FaFilePdf, FaFileImage, FaFileVideo, FaFileAudio, FaFile } from 'react-icons/fa';
import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';
import TextField from "@mui/material/TextField";
import { useParams } from 'react-router-dom';
import { RepositoryRequest } from '../../../type/RepositoryType';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RepositoryEditPage: React.FC = () => {
  const { repository_id } = useParams<{ repository_id: string }>();
  const editorRef = useRef<Editor>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);  // 새 파일 관리
  const [fileUrls, setFileUrls] = useState<string[]>([]);  // 기존 파일 관리
  const [_, setFileNames] = useState<string[]>([]); 
  const [mongoDocumentId, setMongoDocumentId] = useState<string>(""); // MongoDB 문서 ID 상태
  const [description, setDescription] = useState("")

  const BASE_URL = "https://k11d202.p.ssafy.io";
  // const BASE_URL = "https://localhost:8080";

  const notify = () => {
    toast.success("파일 업로드 성공!");
  };
  
  const notifyfail = () => {
    toast.error("게시글 내용이 부족합니다.")
  };

  // 페이지 로드 시 기존 레포지토리 데이터와 파일 불러오기
  useEffect(() => {
    const fetchRepositoryData = async () => {
      if (repository_id) {
        try {
          const response = await getRepositoryDetail(parseInt(repository_id, 10));
          const data: RepositoryRequest = response;
          setTitle(data.repositoryTitle);
          setContent(data.repositoryContent);
          setStartDate(data.startDate);
          setEndDate(data.endDate);
          setMongoDocumentId(data.repositoryFileKey);
          setIsPublished(data.repositoryPost);

          if (editorRef.current) {
            editorRef.current.getInstance().setMarkdown(data.repositoryContent);
          }
        } catch (error) {
          console.error("레포지토리 데이터 불러오기 오류:", error);
        }
      }
    };
    fetchRepositoryData();
  }, [repository_id]);

  useEffect(() => {
    const fetchFilesData = async () => {
      if (mongoDocumentId) {
        try {
          const response = await getmyfiles(mongoDocumentId);
          setFileUrls(response.fileUrls); // 기존 파일 URL 저장
          setFileNames(response.fileNames);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchFilesData();
  }, [mongoDocumentId]);
  
  // 이미지 업로드
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
      repositoryPost: isPublished
    };
    if (repository_id) {
      patchRepository(repository_id, repositoryData);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  // 파일 삭제 함수 (기존 파일 및 새 파일)
  const removeFile = (file: File | string) => {
    if (typeof file === 'string') {
      // 삭제할 파일의 인덱스를 찾음
      const indexToRemove = fileUrls.indexOf(file);
      if (indexToRemove > -1) {
        // fileUrls와 fileNames에서 동일한 인덱스를 삭제
        setFileUrls((prevUrls) => prevUrls.filter((_, index) => index !== indexToRemove));
        setFileNames((prevNames) => prevNames.filter((_, index) => index !== indexToRemove));
      }
    } else {
      // 새 파일 목록에서 파일 삭제
      setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
    }
  };

  const handleUpload = async () => {
    const documentId = await repoupdate(mongoDocumentId, files);
    if (documentId) {
      setMongoDocumentId(documentId);
      notify();
      setFiles([])
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  return (
    <div className='min-h-screen'> 
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
        <ul style={{ listStyleType: 'none', padding: 0, maxHeight: '150px', overflowY: 'auto' }}>
          {fileUrls.map((url, index) => (
            <li key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 8fr 1fr', alignItems: 'center', marginBottom: '5px' }}>
              <span>{getFileIcon(url)}</span>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                {url.split('/').pop()}
              </a>
              <button onClick={() => removeFile(url)} style={{ color: 'red', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer' }}>X</button>
            </li>
          ))}
          {files.map((file, index) => (
            <li key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 8fr 1fr', alignItems: 'center', marginBottom: '5px' }}>
              <span>{getFileIcon(file.name)}</span>
              <span>{file.name}</span>
              <button onClick={() => removeFile(file)} style={{ color: 'red', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer' }}>X</button>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleUpload} disabled={files.length === 0} className="mt-3">
        파일 업로드
      </button>
      <button onClick={handleSave} className="mt-5 px-5 py-3 text-lg font-semibold rounded-lg">
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
                className={`mt-2 px-3 py-1 rounded ${isPublished ? 'bg-blue-300' : 'bg-red-300'}`}
              >
                {isPublished ? 'Public' : 'Private'}
              </button>
            </div>

            <div className="flex justify-end space-x-3">
              <button onClick={handleModalClose} className="px-4 py-2 bg-gray-300 rounded-lg">취소</button>
              <button onClick={handleModalSave} className="px-4 py-2 bg-blue-500 text-white rounded-lg">저장</button>
              <ToastContainer />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryEditPage;
