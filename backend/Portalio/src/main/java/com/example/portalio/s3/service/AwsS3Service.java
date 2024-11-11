package com.example.portalio.s3.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
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
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;

@Service
@RequiredArgsConstructor
public class AwsS3Service {

    @Value("${cloud.aws.s3.bucket-name}")
    private String bucketName;

    private final AmazonS3 amazonS3;
    private final FileRepository fileRepository;

    public String upLoadFile(List<MultipartFile> files, String folderName) {
        List<String> fileUrls = new ArrayList<>();

        files.forEach(file -> {
            String fileName = createFileName(folderName, file.getOriginalFilename());
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

        FileDocument fileDocument = new FileDocument(fileUrls);
        fileRepository.save(fileDocument);

        // 첫 번째 파일 URL 반환
        return fileUrls.get(0);
    }

    public String uploadFilesAsZip(List<MultipartFile> files, String folderName) {
        String zipFileName = createFileName(folderName, "archive.zip");
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try (ZipOutputStream zipOutputStream = new ZipOutputStream(byteArrayOutputStream)) {
            for (MultipartFile file : files) {
                String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "default_filename";
                ZipEntry zipEntry = new ZipEntry(fileName);
                zipOutputStream.putNextEntry(zipEntry);
                zipOutputStream.write(file.getBytes());
                zipOutputStream.closeEntry();
            }
            zipOutputStream.finish();

            byte[] zipBytes = byteArrayOutputStream.toByteArray();
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(zipBytes);
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentLength(zipBytes.length);
            objectMetadata.setContentType("application/zip");

            amazonS3.putObject(new PutObjectRequest(bucketName, zipFileName, byteArrayInputStream, objectMetadata));

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 압축 및 업로드에 실패했습니다.");
        }

        // S3 SDK의 getUrl 메서드를 사용하여 URL 생성
        return amazonS3.getUrl(bucketName, zipFileName).toString();
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
