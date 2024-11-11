import axios from "axios";

// const BASE_URL = "http://localhost:8080";
const BASE_URL = "http://k11d202.p.ssafy.io";


export const onUploadImage = async (
  blob: Blob,
  callback: (url: string, alt: string) => void,
  urls: string
) => {
  try {
    const formData = new FormData();
    formData.append("multipartFile", blob); // 'multipartFile' 이름으로 이미지를 추가
    formData.append("folderName", urls); // 'folderName'도 추가

    const response = await axios.post(`${BASE_URL}/s3/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const imageUrl = response.data; // axios는 기본적으로 JSON으로 응답을 파싱함
    callback(imageUrl, "이미지 설명");
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
  }
};

// ZIP 파일 업로드 API 함수
export const uploadFilesAsZip = async (
  files: File[],
  folderName: string
): Promise<string | null> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("multipartFile", file); // 파일들을 'multipartFile'로 추가
    });
    formData.append("folderName", folderName); // 폴더 이름 추가

    // ZIP 파일 업로드를 위한 POST 요청
    const response = await axios.post(`${BASE_URL}/api/v1/files`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // 성공적으로 업로드된 ZIP 파일의 URL 반환
    return response.data;
  } catch (error) {
    console.error("ZIP 파일 업로드 오류:", error);
    return null;
  }
};