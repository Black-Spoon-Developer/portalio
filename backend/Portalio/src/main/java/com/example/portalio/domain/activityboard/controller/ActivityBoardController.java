package com.example.portalio.domain.activityboard.controller;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.activityboard.dto.ActivityBoardListResponse;
import com.example.portalio.domain.activityboard.dto.ActivityBoardRequest;
import com.example.portalio.domain.activityboard.dto.ActivityBoardResponse;
import com.example.portalio.domain.activityboard.service.ActivityBoardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/activity")
public class ActivityBoardController {

    private final ActivityBoardService activityBoardService;

    @Operation(summary = "[활동게시판]글 검색", description = "title 사용해 글 검색")
    @GetMapping
    public ResponseEntity<ActivityBoardListResponse> getActivityBoard(
            @RequestParam(required = false) String searchTerm) {

        ActivityBoardListResponse response = activityBoardService.getActivityBoardSearch(searchTerm);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[활동게시판]글 상세보기", description = "activityBoardId 입력해 한개의 글 상세보기")
    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityBoardResponse> getActivityBoardDetail(@PathVariable("activityId") Long activityId) {

        ActivityBoardResponse response = activityBoardService.getActivityBoardDetails(activityId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[활동게시판]글 전체보기(리스트)", description = "페이지네이션, skip을 10씩 증가해서 넣으세요, limit 10 고정 ")
    @GetMapping("/all")
    public ResponseEntity<ActivityBoardListResponse> getAllActivityBoard(
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit) {

        ActivityBoardListResponse response = activityBoardService.getActivityBoardList(skip, limit);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[활동게시판]글 전체보기(내가 쓴 글만)", description = "페이지네이션")
    @GetMapping("/my/{username}")
    public ResponseEntity<ActivityBoardListResponse> getMyActivityList(
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit,
            @PathVariable String username) {

        ActivityBoardListResponse response = activityBoardService.getMyActivityBoardList(skip, limit, username);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[활동게시판]특정 레포지토리에 포함된 활동게시글만 불러오기", description = "레포지토리 id값을 보내 해당 활동게시글만 가져오기")
    @GetMapping("/onlyactivity/{repositoryId}")
    public ResponseEntity<ActivityBoardListResponse> getActivityBoardListDetail(
            @PathVariable Long repositoryId) {

        ActivityBoardListResponse response = activityBoardService.getActivityBoardListDetail(repositoryId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[활동게시판]글 작성", description = "글 작성")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/onlyactivity")
    public ResponseEntity<ActivityBoardResponse> registerActivityBoard(
            @RequestBody @Valid ActivityBoardRequest request,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        ActivityBoardResponse response = activityBoardService.registerActivityBoard(request, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[활동게시판]글 수정", description = "글 수정")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/onlyactivity/{repositoryId}/{activityId}")
    public ResponseEntity<ActivityBoardResponse> updateActivityBoard(
            @PathVariable Long repositoryId,
            @PathVariable Long activityId,
            @RequestBody @Valid ActivityBoardRequest request,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        ActivityBoardResponse response = activityBoardService.updateActivityBoard(repositoryId, activityId, request, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[활동게시판]글 삭제", description = "글 삭제")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/onlyactivity/{repositoryId}/{activityId}")
    public ResponseEntity<ActivityBoardResponse> deleteActivityBoard(
            @PathVariable Long repositoryId,
            @PathVariable Long activityId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        ActivityBoardResponse response = activityBoardService.deleteActivityBoard(repositoryId, activityId, oauth2User);

        return ResponseEntity.ok(response);
    }
}
