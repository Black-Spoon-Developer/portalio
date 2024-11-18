package com.example.portalio.domain.jobhistory.controller;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.jobhistory.dto.JobHistoryEditRequest;
import com.example.portalio.domain.jobhistory.dto.JobHistoryListResponse;
import com.example.portalio.domain.jobhistory.dto.JobHistoryRequest;
import com.example.portalio.domain.jobhistory.dto.JobHistoryResponse;
import com.example.portalio.domain.jobhistory.service.JobHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
    @GetMapping("/{memberUsername}")
    public ResponseEntity<?> getJobHistoryList(@PathVariable("memberUsername") String memberUsername) {

        JobHistoryListResponse response = jobHistoryService.getJobHistoryList(memberUsername);

        return ResponseEntity.ok(response);
    }

    // 유저 경력/이력 저장
    @Operation(summary = "[경력/이력]유저의 경력/이력 저장", description = "memberId와 requestBody에 담은 값으로 저장")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/save")
    public ResponseEntity<?> saveJobHistory(@AuthenticationPrincipal CustomOAuth2User oauth2User, @RequestBody JobHistoryRequest request) {
        JobHistoryResponse response = jobHistoryService.saveJobHistory(oauth2User, request);

        return ResponseEntity.ok(response);
    }
    
    // 유저 경력/이력 수정
    @Operation(summary = "[경력/이력]유저의 경력/이력 수정", description = "memberId와 requestBody에 담은 값으로 수정")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/edit")
    public ResponseEntity<?> editJobHistory(@RequestBody JobHistoryEditRequest request) {
        JobHistoryResponse response =  jobHistoryService.editJobHistory(request);

        return ResponseEntity.ok(response);
    }

    // 유저 경력/이력 삭제
    @Operation(summary = "[경력/이력]유저의 경력/이력 삭제", description = "jobHistoryId 값으로 삭제")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/delete/{jobHistoryId}")
    public ResponseEntity<?> deleteJobHistory(@PathVariable("jobHistoryId") Long jobHistoryId) {
        JobHistoryResponse response = jobHistoryService.deleteJobHistory(jobHistoryId);

        return ResponseEntity.ok(response);
    }

}
