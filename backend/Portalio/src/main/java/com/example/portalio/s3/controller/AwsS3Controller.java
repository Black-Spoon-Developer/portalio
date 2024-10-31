package com.example.portalio.s3.controller;

import com.example.portalio.s3.service.AwsS3Service;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/s3")
public class AwsS3Controller {

    private final AwsS3Service awsS3Service;

    @Operation(summary = "Amazon S3에 이미지 업로드", description = "Activity_board : 활동게시판"
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
}
