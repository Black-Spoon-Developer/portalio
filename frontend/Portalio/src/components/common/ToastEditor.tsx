import React, { useRef, useEffect } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';

const ToastEditor: React.FC = () => {
  const editorRef = useRef<Editor>(null);

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
      formData.append("multipartFile", blob); // 'multipartFile' 이름으로 이미지를 추가
      formData.append("folderName", "Activity_board"); // 'folderName'도 추가
  
      const response = await axios.post("http://localhost:8080/s3/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const imageUrl = response.data; // axios는 기본적으로 JSON으로 응답을 파싱함
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

      // 줄바꿈을 \n으로 변환
      const formattedContent = markdownContent.replace(/\r?\n/g, "\\n");
      console.log("Formatted Markdown Content:", formattedContent);
    }
  };

  return (
    <div className="">
      {/* 상단 제목 구역 */}
      <div className="flex mb-5">
        {/* 제목 입력 필드 */}
        <input 
          type="text" 
          placeholder="제목을 입력하세요" 
          className="w-full p-3 text-4xl rounded-lg"
        />
      </div>

      {/* 에디터 */}
      <Editor
        ref={editorRef}
        initialValue="Hello, Toast UI Editor with Plugins!"
        previewStyle="vertical"
        height="900px"
        initialEditType="markdown"
        useCommandShortcut={true}
        hooks={{
          addImageBlobHook: onUploadImage
        }}
      />

      {/* 저장 버튼 */}
      <button 
        onClick={handleSave} 
        className="mt-5 px-5 py-3 text-lg font-semibold rounded-lg"
      >
        저장
      </button>
    </div>
  );
};

export default ToastEditor;
