package com.example.portalio.domain.portfoliocomment.controller;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.portfoliocomment.dto.PortfolioCommentListResponse;
import com.example.portalio.domain.portfoliocomment.dto.PortfolioCommentRequest;
import com.example.portalio.domain.portfoliocomment.dto.PortfolioCommentResponse;
import com.example.portalio.domain.portfoliocomment.service.PortfolioCommentService;
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
@RequestMapping("/api/v1/portfolios")
public class PortfolioCommentController {

    private final PortfolioCommentService portfolioCommentService;

    @Operation(summary = "[포트폴리오]글 댓글", description = "댓글 보기")
    @GetMapping("/{portfoliosId}/comments")
    public ResponseEntity<PortfolioCommentListResponse> getPortfolioCommentList(
            @PathVariable Long portfoliosId) {

        PortfolioCommentListResponse response = portfolioCommentService.getPortfolioCommentList(portfoliosId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오]글 댓글 쓰기", description = "댓글 쓰기")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{portfoliosId}/comments")
    public ResponseEntity<PortfolioCommentResponse> createPortfolioComment(
            @RequestBody @Valid PortfolioCommentRequest request,
            @PathVariable Long portfoliosId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        PortfolioCommentResponse response = portfolioCommentService.createPortfolioComment(request, portfoliosId, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오]글 댓글 수정", description = "댓글 수정")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{portfoliosId}/comments/{commentsId}")
    public ResponseEntity<PortfolioCommentResponse> updatePortfolioComment(
            @RequestBody @Valid PortfolioCommentRequest request,
            @PathVariable Long portfoliosId,
            @PathVariable Long commentsId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        PortfolioCommentResponse response = portfolioCommentService.updatePortfolioComment(request, portfoliosId, commentsId, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오]글 댓글 삭제", description = "댓글 삭제")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{portfoliosId}/comments/{commentsId}")
    public ResponseEntity<PortfolioCommentResponse> deletePortfolioComment(
            @PathVariable Long portfoliosId,
            @PathVariable Long commentsId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        PortfolioCommentResponse response = portfolioCommentService.deletePortfolioComment(portfoliosId, commentsId, oauth2User);

        return ResponseEntity.ok(response);
    }
}
