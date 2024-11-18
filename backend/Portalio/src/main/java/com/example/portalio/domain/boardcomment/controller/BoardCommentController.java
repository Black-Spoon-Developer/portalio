package com.example.portalio.domain.boardcomment.controller;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.boardcomment.dto.BoardCommentListResponse;
import com.example.portalio.domain.boardcomment.dto.BoardCommentRequest;
import com.example.portalio.domain.boardcomment.dto.BoardCommentResponse;
import com.example.portalio.domain.boardcomment.service.BoardCommentService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/boards")
public class BoardCommentController {

    private final BoardCommentService boardCommentService;


    @Operation(summary = "[자유/질문]글 댓글", description = "댓글 보기")
    @GetMapping("/{boardsId}/comments")
    public ResponseEntity<BoardCommentListResponse> getBoardCommentList(
            @PathVariable Long boardsId) {
        BoardCommentListResponse response = boardCommentService.getBoardCommentList(boardsId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[자유/질문]글 댓글 쓰기", description = "댓글 쓰기")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{boardsId}/comments")
    public ResponseEntity<BoardCommentResponse> createBoardComment(
            @RequestBody @Valid BoardCommentRequest request,
            @PathVariable Long boardsId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        BoardCommentResponse response = boardCommentService.createBoardComment(request, boardsId, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[자유/질문]글 댓글 수정", description = "댓글 수정")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{boardsId}/comments/{commentsId}")
    public ResponseEntity<BoardCommentResponse> updateBoardComment(
            @RequestBody @Valid BoardCommentRequest request,
            @PathVariable Long boardsId,
            @PathVariable Long commentsId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        BoardCommentResponse response = boardCommentService.updateBoardComment(request, boardsId, commentsId, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[자유/질문]글 댓글 삭제", description = "댓글 삭제")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{boardsId}/comments/{commentsId}")
    public ResponseEntity<BoardCommentResponse> deleteBoardComment(
            @PathVariable Long boardsId,
            @PathVariable Long commentsId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        BoardCommentResponse response = boardCommentService.deleteBoardComment(boardsId, commentsId, oauth2User);

        return ResponseEntity.ok(response);
    }
}
