import React, { useRef, useEffect, useState } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getActivityBoard, patchActivityBoard } from '../../../api/ActivityAPI';
import { ActivityRequest } from '../../../type/ActivityType';
import { RepositoryResponse } from '../../../type/RepositoryType';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { getMyRepositoryList } from '../../../api/RepositoryAPI';

const PortfolioEditPage: React.FC = () => {
  const { repository_id } = useParams<{ repository_id: string }>();
  const { activity_id } = useParams<{ activity_id: string }>();
  const today = new Date().toISOString().split('T')[0];
  const editorRef = useRef<Editor>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [boardDate, setBoardDate] = useState<string>("");
  const [startDate, setStartDate] = useState(today);
  const [title, setTitle] = useState<string>("");
  const [items, setItems] = useState<RepositoryResponse[]>([]);
  const [content, setContent] = useState<string>("");
  const username = useSelector((state: RootState) => state.auth.username) ?? "Guest";
  
  const BASE_URL = "https://k11d202.p.ssafy.io";
  // const BASE_URL = "http://localhost:8080/";

  const notifyfail = () => {
    toast.error("게시글 내용이 부족합니다.")
  };


  useEffect(() => {
    // 활동게시판 데이터 불러오기
    const fetchActivityData = async () => {
      if (activity_id) {
        try {
          const response = await getActivityBoard(activity_id); // API 호출
          const data: ActivityRequest = response.data; // response의 data를 PortfolioResponse로 타입 지정
  
          setTitle(data.activityBoardTitle);
          setContent(data.activityBoardContent);
          setBoardDate(data.activityBoardDate);
  
          if (editorRef.current) {
            editorRef.current.getInstance().setMarkdown(data.activityBoardContent);
          }
        } catch (error) {
          console.error("활동게시판 데이터 불러오기 오류:", error);
        }
      }
    };
    fetchActivityData();
  }, [activity_id]);

  useEffect(() => {
    const fetchMyRepository = async () => {
      if (username) {
        try {
          const response = await getMyRepositoryList(username);
          setItems(response.items);

        } catch (error) {
          console.error("레포지토리 리스트 불러오기 오류:", error)
        }
      }
    }
    fetchMyRepository();
  }, [username]);

  const onUploadImage = async (
    blob: Blob,
    callback: (url: string, alt: string) => void
  ) => {
    try {
      const formData = new FormData();
      formData.append("multipartFile", blob);
      formData.append("folderName", "Activity_board");
  
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

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = async () => {
    if (!title || !content || !boardDate) {
      notifyfail()
      return;
    }
    
    const activityData: ActivityRequest = {
      activityBoardTitle: title,
      activityBoardContent: content,
      activityBoardDate: boardDate,
    };

    if (repository_id && activity_id) {
      await patchActivityBoard(repository_id, activity_id, activityData);
    }
  };

  
  const [selectedRepository, setSelectedRepository] = useState<
  number | null
>(null);

const handleRepositoryChange = (event: SelectChangeEvent<number>) => {
  const mainRepositoryId = Number(event.target.value);
  setSelectedRepository(mainRepositoryId);
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
            value={selectedRepository || ""}
            onChange={handleRepositoryChange}
            displayEmpty
            className="w-full"
          >
            <MenuItem value="" disabled>
              레포지토리 선택
            </MenuItem>
            {items.map((item) => (
              <MenuItem key={item.repositoryId}>
                {item.repositoryTitle}
              </MenuItem>
            ))}
          </Select>
        </div>
      </AccordionDetails>
    </Accordion>
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

export default PortfolioEditPage;
