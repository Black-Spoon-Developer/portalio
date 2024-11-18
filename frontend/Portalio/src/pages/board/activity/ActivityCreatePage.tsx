import React, { useRef, useEffect, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMyRepositoryList } from "../../../api/RepositoryAPI";
import { RootState } from "../../../store";
import { registerActivity } from "../../../api/ActivityAPI";
import TextField from "@mui/material/TextField";
import { RepositoryResponse } from "../../../type/RepositoryType";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userTicketUpdate } from "../../../api/TicketAPI";
import { templates } from "../portfolio/PortfolioData";

const ActivityCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [repositoryId, setRepositoryId] = useState<number>(0);
  const today = new Date().toISOString().split("T")[0];
  const editorRef = useRef<Editor>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [items, setItems] = useState<RepositoryResponse[]>([]);
  const username =
    useSelector((state: RootState) => state.auth.memberUsername) ?? "Guest";

  // const BASE_URL = "http://localhost:8080";
  const BASE_URL = "https://k11d202.p.ssafy.io";

  const notifyfail = () => {
    toast.error("게시글 내용이 부족합니다.");
  };

  useEffect(() => {
    const fetchMyRepository = async () => {
      if (username) {
        try {
          const response = await getMyRepositoryList(username);
          setItems(response.items);
        } catch (error) {
          console.error("레포지토리 리스트 불러오기 오류:", error);
        }
      }
    };
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

  // 모달 닫는 핸들러
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // 최종 저장 핸들러
  const handleModalSave = async () => {
    if (!title || !content) {
      notifyfail();

      return;
    }

    const activityBoardData = {
      activityBoardTitle: title,
      activityBoardContent: content,
      activityBoardDate: startDate,
      repositoryId: repositoryId,
    };

    // 활동 게시글 등록 요청
    await registerActivity(activityBoardData);

    // 티켓 1개 지급
    await userTicketUpdate(1);

    // 활동 게시판으로 이동
    navigate("/");
  };

  const [selectedRepository, setSelectedRepository] = useState<number | null>(
    null
  );

  const handleRepositoryChange = (event: SelectChangeEvent<number>) => {
    const mainRepositoryId = Number(event.target.value);
    setSelectedRepository(mainRepositoryId);
    setRepositoryId(mainRepositoryId);
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
                    <MenuItem key={item.repositoryId} value={item.repositoryId}>
                      {item.repositoryTitle}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div>
              <button
                  onClick={() => window.open("/markdown-guide", "_blank", "width=800,height=600")}
                  className="m-3 px-3 p-2 text-lg font-semibold rounded-lg bg-gray-500 text-white hover:bg-gray-600"
                >
                  MarkDown 사용법
                </button>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>

        {/* 시작 날짜와 종료 날짜 입력 */}
        <div className="flex mb-5 space-x-4">
          <TextField
            label="활동 날짜"
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
          initialValue={templates.defaultMarkdown}
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
              <section className="font-bold text-xl py-6">
                게시물을 정말 작성 하시겠습니까?
              </section>
              <section className="flex justify-end space-x-3">
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
                  작성
                </button>
                <ToastContainer />
              </section>
            </div>
          </div>
        )}
    </div>
  );
};

export default ActivityCreatePage;
