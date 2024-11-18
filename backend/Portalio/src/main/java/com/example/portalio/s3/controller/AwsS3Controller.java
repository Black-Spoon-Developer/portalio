package com.example.portalio.s3.controller;

import com.example.portalio.mongo.document.FileDocument;
import com.example.portalio.s3.service.AwsS3Service;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/s3")
public class AwsS3Controller {

    private final AwsS3Service awsS3Service;

    @Operation(summary = "Amazon S3에 이미지 업로드", description =
            "Activity_board : 활동게시판"
                    + "\n Free_board : 자유게시판"
                    + "\n Member : 회원프로필"
                    + "\n Portfolio_board : 포트폴리오 게시판"
                    + "\n Question_board : 질문 게시판"
                    + "\n Repository : 레포지토리 게시판")
    @PostMapping(value = "/image", consumes = "multipart/form-data")
    public ResponseEntity<String> uploadImage(
            @RequestParam String folderName,
            @Parameter(
                    description = "파일 (여러 파일 업로드 가능)",
                    required = false,
                    content = @Content(
                            mediaType = "multipart/form-data",
                            schema = @Schema(type = "array", format = "binary")
                    )
            )
            @RequestPart List<MultipartFile> multipartFile) {

        return ResponseEntity.ok(awsS3Service.upLoadFile(multipartFile, folderName));
    }

    @Operation(summary = "Amazon S3에 다수의 파일 업로드", description = "Repository : 레포지토리 게시판")
    @PostMapping(value = "/repofiles", consumes = "multipart/form-data")
    public ResponseEntity<String> uploadRepofiles(
            @RequestPart List<MultipartFile> multipartFile) {


        String documentId = awsS3Service.uploadRepofiles(multipartFile);
        return ResponseEntity.ok(documentId);
    }

    @Operation(summary = "유저가 다운로드 버튼을 누르면 zip으로 다운로드", description = "documentId : mongodbID")
    @GetMapping("/download-zip/{documentId}")
    public ResponseEntity<InputStreamResource> downloadFilesAsZip(
            @PathVariable String documentId) {


        InputStream zipStream = awsS3Service.getFileAsStream(documentId);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=\"files.zip\"");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(zipStream));
    }

    @Operation(summary = "레포지토리 파일 업데이트", description = " : ")
    @PostMapping(value = "/repofiles/update/{documentId}", consumes = "multipart/form-data")
    public ResponseEntity<String> updateRepofiles(
            @PathVariable String documentId,
            @RequestParam("files") List<MultipartFile> files) {
        // 파일을 업로드하고 S3에 저장된 URL 리스트 반환
        String outputDocumentId = awsS3Service.updateRepofiles(documentId, files);

        return ResponseEntity.ok(outputDocumentId);
    }

    @Operation(summary = "프로필 사진 업로드", description = "회원 프로필 사진을 업로드하고 S3 URL을 반환")
    @PostMapping(value = "/profile-picture", consumes = "multipart/form-data")
    public ResponseEntity<String> updateProfilePicture(
            @RequestParam MultipartFile file) {

        String folderName = "Member"; // S3 폴더명

        String  fileUrl = awsS3Service.upLoadFile(List.of(file), folderName); // S3에 업로드 및 URL 반환

        return ResponseEntity.ok(fileUrl);
    }
}
