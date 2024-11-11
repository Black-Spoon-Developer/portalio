import React, { useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';

const ToastEditorWithVideo: React.FC = () => {
  const editorRef = useRef<Editor>(null);

  // 파일 업로드 함수
  const onUploadFile = async (file: File, callback: (url: string, alt: string) => void): Promise<void> => {
    const formData = new FormData();
    formData.append("multipartFile", file);
    formData.append("folderName", "Activity_board");

    try {
      const response = await axios.post<string>("http://localhost:8080/s3/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const fileUrl = response.data;

      if (file.type.startsWith('video/')) {
        const videoTag = `<video controls width="600">
                            <source src="${fileUrl}" type="${file.type}">
                            해당 브라우저는 동영상 재생을 지원하지 않습니다.
                          </video>`;
        editorRef.current?.getInstance().insertText(videoTag);
      } else {
        callback(fileUrl, '업로드된 이미지');
      }
    } catch (error) {
      console.error("파일 업로드 오류:", error);
    }
  };

  return (
    <div>
      <Editor
        ref={editorRef}
        initialValue="여기에 이미지를 추가하거나 동영상을 업로드할 수 있습니다."
        previewStyle="vertical"
        height="400px"
        initialEditType="markdown"
        useCommandShortcut={true}
        hooks={{
          addImageBlobHook: (blob: Blob | File, callback: (url: string, alt: string) => void): boolean => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = ''; // 모든 파일 선택 가능
            fileInput.onchange = () => {
              const file = fileInput.files?.[0];
              if (file) {
                onUploadFile(file, callback);
              }
            };
            fileInput.click();
            return false; // 기본 처리 방지
          },
        }}
      />
    </div>
  );
};

export default ToastEditorWithVideo;
