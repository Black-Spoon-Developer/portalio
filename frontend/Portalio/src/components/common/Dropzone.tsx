import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { onUploadImage } from '../../api/S3ImageUploadAPI';

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]); // 업로드된 이미지 URL 저장용 상태

  // 파일이 드롭되거나 파일 탐색기로 선택되었을 때 실행될 콜백
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const handleUpload = async () => {
    for (const file of files) {
      await onUploadImage(file, (url, alt) => {
        console.log(`업로드된 URL: ${url}`);
        setUploadedUrls((prevUrls) => [...prevUrls, url]); // 업로드된 URL 추가
      }, "Activity_board"); // 'folderName'으로 사용할 값
    }
    setFiles([]); // 업로드 완료 후 파일 목록 초기화
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
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
        {isDragActive ? (
          <p>파일을 여기에 놓으세요</p>
        ) : (
          <p>파일을 드래그하거나 클릭하여 추가하세요</p>
        )}
      </div>

      {/* 선택된 파일 목록 */}
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>

      {/* 업로드된 파일 URL 목록 */}
      <ul className="mt-3">
        {uploadedUrls.map((url, index) => (
          <li key={index}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </li>
        ))}
      </ul>

      {/* 업로드 버튼 */}
      <button onClick={handleUpload} disabled={files.length === 0}>
        파일 업로드
      </button>
    </div>
  );
};

export default FileUpload;
