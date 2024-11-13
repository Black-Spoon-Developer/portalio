package com.example.portalio.domain.repository.controller;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.repository.dto.RepositoryListResponse;
import com.example.portalio.domain.repository.dto.RepositoryPostResponse;
import com.example.portalio.domain.repository.dto.RepositoryRequest;
import com.example.portalio.domain.repository.dto.RepositoryResponse;
import com.example.portalio.domain.repository.service.RepositoryService;
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
@RequestMapping("/api/v1/repository")
public class RepositoryController {

    private final RepositoryService repositoryService;

    @Operation(summary = "[레포지토리]글 상세보기", description = "내 레포지토리 상세보기")
    @GetMapping("/{repositoryId}/detail")
    public ResponseEntity<RepositoryResponse> getRepositoryDetail(
            @PathVariable Long repositoryId) {

        RepositoryResponse response = repositoryService.getRepositoryDetail(repositoryId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[레포지토리]글 전체보기", description = "내 정보 탭에서 레포지토리 전체보기(post = true)")
    @GetMapping
    public ResponseEntity<RepositoryListResponse> getRepositoryList(
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit) {

        RepositoryListResponse response = repositoryService.getRepositoryList(skip, limit);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[레포지토리]글 전체보기(내 것만, 내정보에서 활용)", description = "내 레포지토리 전체보기")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{username}")
    public ResponseEntity<RepositoryListResponse> getMyRepositoryList(
            @PathVariable String username,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        RepositoryListResponse response = repositoryService.getMyRepositoryList(oauth2User, username);

        return ResponseEntity.ok(response);
    }


    @Operation(summary = "[레포지토리]글 작성", description = "레포지토리 작성")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<RepositoryResponse> registerRepository(
            @RequestBody @Valid RepositoryRequest request,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        RepositoryResponse response = repositoryService.registerRepository(request, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[레포지토리]글 수정", description = "레포지토리 수정")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{repositoryId}")
    public ResponseEntity<RepositoryResponse> updateRepository(
            @PathVariable Long repositoryId,
            @RequestBody @Valid RepositoryRequest request,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        RepositoryResponse response = repositoryService.updateRepository(repositoryId, request, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[레포지토리]글 삭제", description = "레포지토리 삭제")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{repositoryId}")
    public ResponseEntity<RepositoryResponse> deleteRepository(
            @PathVariable Long repositoryId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        RepositoryResponse response = repositoryService.deleteRepository(repositoryId, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[레포지토리]글 게시", description = "레포지토리 게시")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{repositoryId}/post")
    public ResponseEntity<RepositoryPostResponse> postRepository(
            @PathVariable Long repositoryId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        RepositoryPostResponse response = repositoryService.postRepository(repositoryId, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[레포지토리]글 게시", description = "레포지토리 게시")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{repositoryId}/primary")
    public ResponseEntity<RepositoryPostResponse> primaryRepository(
            @PathVariable Long repositoryId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        RepositoryPostResponse response = repositoryService.primaryRepository(repositoryId, oauth2User);

        return ResponseEntity.ok(response);
    }
}
