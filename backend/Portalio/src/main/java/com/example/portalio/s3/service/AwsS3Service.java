package com.example.portalio.s3.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.example.portalio.mongo.document.FileDocument;
import com.example.portalio.mongo.repository.FileRepository;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AwsS3Service {

    @Value("${cloud.aws.s3.bucket-name}")
    private String bucketName;

    private final AmazonS3 amazonS3;
    private final FileRepository fileRepository;

    public String upLoadFile(List<MultipartFile> files, String folderName) {
        List<String> fileUrls = new ArrayList<>();
        List<String> fileNames = new ArrayList<>();

        files.forEach(file -> {
            String realfileName = file.getOriginalFilename(); // 원본 파일 이름
            fileNames.add(realfileName);

            String fileName = createFileName(folderName, realfileName);
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentLength(file.getSize());
            objectMetadata.setContentType(file.getContentType());

            try (InputStream inputStream = file.getInputStream()) {
                // ACL 설정 제거
                amazonS3.putObject(new PutObjectRequest(bucketName, fileName, inputStream, objectMetadata));
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 업로드에 실패했습니다.");
            }

            // S3 URL 생성
            String fileUrl = "https://" + bucketName + ".s3." + "ap-northeast-2.amazonaws.com/" + fileName;
            fileUrls.add(fileUrl);
        });

        FileDocument fileDocument = new FileDocument(fileUrls, fileNames);
        fileRepository.save(fileDocument);

        // 첫 번째 파일 URL 반환
        return fileUrls.get(0);
    }

    public String uploadRepofiles(List<MultipartFile> files) {
        List<String> fileUrls = new ArrayList<>();
        List<String> fileNames = new ArrayList<>();
        String folderName = "Repository";

        // S3에 각 파일을 업로드하고 URL 리스트 생성
        files.forEach(file -> {
            String realfileName = file.getOriginalFilename(); // 원본 파일 이름
            fileNames.add(realfileName);

            String fileName = createFileNames(folderName, realfileName);
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentLength(file.getSize());
            objectMetadata.setContentType(file.getContentType());

            try (InputStream inputStream = file.getInputStream()) {
                amazonS3.putObject(new PutObjectRequest(bucketName, fileName, inputStream, objectMetadata));
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 업로드에 실패했습니다.");
            }

            String fileUrl = "https://" + bucketName + ".s3." + "ap-northeast-2.amazonaws.com/" + fileName;
            fileUrls.add(fileUrl);
        });

        // URL 리스트를 MongoDB에 저장
        FileDocument fileDocument = new FileDocument(fileUrls, fileNames);
        FileDocument savedDocument = fileRepository.save(fileDocument);

        // 저장된 문서의 ID 반환
        return savedDocument.getId();
    }

    public InputStream getFileAsStream(String documentId) {

        FileDocument fileDocument = fileRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("문서를 찾을 수 없습니다"));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            List<String> fileUrls = fileDocument.getFileUrls();
            List<String> fileNames = fileDocument.getFileNames();

            for (int i = 0; i < fileUrls.size(); i++) {
                String url = fileUrls.get(i);
                String fileName = fileNames.get(i); // 원본 파일 이름

                ZipEntry zipEntry = new ZipEntry(fileName);
                zos.putNextEntry(zipEntry);

                String bucketKey = url.substring(url.indexOf(".com/") + 5);
                S3Object s3Object = amazonS3.getObject(bucketName, bucketKey);

                try (InputStream fileStream = s3Object.getObjectContent()) {
                    fileStream.transferTo(zos);
                }
                zos.closeEntry();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return new ByteArrayInputStream(baos.toByteArray()); // 생성된 ZIP 파일의 InputStream 반환
    }

    public String updateRepofiles(String documentId, List<MultipartFile> files) {

        String folderName = "Repository";

        FileDocument fileDocument = fileRepository.findFileUrlsAndFileNames(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        List<String> fileUrls = new ArrayList<>(fileDocument.getFileUrls());
        List<String> fileNames = new ArrayList<>(fileDocument.getFileNames());

        // S3에 각 파일을 업로드하고 URL 리스트 생성
        files.forEach(file -> {
            String realfileName = file.getOriginalFilename(); // 원본 파일 이름
            fileNames.add(realfileName);

            String fileName = createFileNames(folderName, realfileName);
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentLength(file.getSize());
            objectMetadata.setContentType(file.getContentType());

            try (InputStream inputStream = file.getInputStream()) {
                amazonS3.putObject(new PutObjectRequest(bucketName, fileName, inputStream, objectMetadata));
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 업로드에 실패했습니다.");
            }

            String fileUrl = "https://" + bucketName + ".s3." + "ap-northeast-2.amazonaws.com/" + fileName;
            fileUrls.add(fileUrl);
        });

        fileDocument = new FileDocument(fileUrls, fileNames);

        // URL 리스트를 MongoDB에 저장
        FileDocument savedDocument = fileRepository.save(fileDocument);

        // 저장된 문서의 ID 반환
        return savedDocument.getId();
    }

    private String createFileNames(String folderName, String originalFilename) {
        return folderName + "/" + System.currentTimeMillis() + "_" + originalFilename;
    }

    private String createFileName(String folderName, String fileName) {
        return folderName + "/" + UUID.randomUUID().toString().concat(getFileExtension(fileName));
    }

    private String getFileExtension(String fileName) {
        try {
            return fileName.substring(fileName.lastIndexOf("."));
        } catch (StringIndexOutOfBoundsException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 형식의 파일("+ fileName + ") 입니다.");
        }
    }

    public void deleteFile(String fileName) {
        amazonS3.deleteObject(new DeleteObjectRequest(bucketName, fileName));
    }
}
