import axios from "axios";
import { BASE_URL } from "./BaseVariable";

export const onUploadImage = async (
  blob: Blob,
  callback: (url: string, alt: string) => void,
  urls: string
) => {
  try {
    const formData = new FormData();
    formData.append("multipartFile", blob); // 'multipartFile' 이름으로 이미지를 추가
    formData.append("folderName", urls); // 'folderName'도 추가

    const response = await axios.post(`${BASE_URL}/api/v1/s3/image`, formData, {
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
    const response = await axios.post(`${BASE_URL}/api/v1/s3/files`, formData, {
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

export const uploadFilesToS3AndSaveToMongo = async (
  files: File[]
): Promise<string | null> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("multipartFile", file);
    });

    const response = await axios.post(
      `${BASE_URL}/api/v1/s3/repofiles`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // MongoDB 문서 ID 반환
  } catch (error) {
    console.error("S3 및 MongoDB 저장 오류:", error);
    return null;
  }
};

export const getmyfiles = async (documentId: String) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/files/info/${documentId}`
  );
  return response.data;
};

export const repoupdate = async (
  documentId: String,
  files: File[]
): Promise<string | null> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await axios.post(
      `${BASE_URL}/api/v1/s3/repofiles/update/${documentId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("S3:", error);
    return null;
  }
};

// 프로필 사진 업로드 함수
export const uploadProfilePicture = async (
  file: File
): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file); // Swagger 문서에 표시된 file로 파일 추가
    const response = await axios.post(
      `${BASE_URL}/api/v1/s3/profile-picture`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // 서버에서 반환된 S3 URL
  } catch (error) {
    console.error("프로필 사진 업로드 오류: ", error);
    return null;
  }
};
