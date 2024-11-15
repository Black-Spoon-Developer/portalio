package com.example.portalio.domain.jobhistory.controller;

import com.example.portalio.domain.jobhistory.dto.JobHistoryListResponse;
import com.example.portalio.domain.jobhistory.dto.JobHistoryRequest;
import com.example.portalio.domain.jobhistory.dto.JobHistoryResponse;
import com.example.portalio.domain.jobhistory.service.JobHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/jobHistory")
public class JobHistoryController {

    private final JobHistoryService jobHistoryService;

    // 유저 경력/이력 전체 조회
    @Operation(summary = "[경력/이력]유저의 경력/이력 전체 조회", description = "memberId를 통해서 조회")
    @GetMapping("/list/{memberId}")
    public ResponseEntity<?> getJobHistoryList(@PathVariable("memberId") Long memberId) {

        JobHistoryListResponse response = jobHistoryService.getJobHistoryList(memberId);

        return ResponseEntity.ok(response);
    }

    // 유저 경력/이력 저장 Long memberId, JobHistoryRequest request
    @Operation(summary = "[경력/이력]유저의 경력/이력 저장", description = "memberId와 requestBody에 담은 값으로 저장")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/save/{memberId}")
    public ResponseEntity<?> saveJobHistory(@PathVariable("memberId") Long memberId, @RequestBody JobHistoryRequest request) {
        JobHistoryResponse response = jobHistoryService.saveJobHistory(memberId, request);

        return ResponseEntity.ok(response);
    }

    // 유저 경력/이력 삭제
    @Operation(summary = "[경력/이력]유저의 경력/이력 저장", description = "memberId와 requestBody에 담은 값으로 저장")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/delete/{jobHistoryId}")
    public ResponseEntity<?> deleteJobHistory(@PathVariable("jobHistoryId") Long jobHistoryId) {
        JobHistoryResponse response = jobHistoryService.deleteJobHistory(jobHistoryId);

        return ResponseEntity.ok(response);
    }

}
