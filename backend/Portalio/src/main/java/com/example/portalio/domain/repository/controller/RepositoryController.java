package com.example.portalio.domain.repository.controller;

import com.example.portalio.domain.repository.dto.RepositoryListResponse;
import com.example.portalio.domain.repository.dto.RepositoryRequest;
import com.example.portalio.domain.repository.dto.RepositoryResponse;
import com.example.portalio.domain.repository.service.RepositoryService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/repository")
public class RepositoryController {

    private final RepositoryService repositoryService;

    @Operation(summary = "[레포지토리]글 상세보기", description = "내 레포지토리 상세보기")
    //@PreAuthorize("isAuthenticated()")
    @GetMapping("/{repositoryId}/detail")
    public ResponseEntity<RepositoryResponse> getRepositoryDetail(
            @PathVariable Long repositoryId
            /**@AuthenticationPrincipal CustomOauth2User oauth2User 로그인 구현 후 주석 해제 **/) {

        RepositoryResponse response = repositoryService.getRepositoryDetail(repositoryId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[레포지토리]글 전체보기", description = "내 레포지토리 전체보기")
    //@PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<RepositoryListResponse> getRepositoryList(
            /**@AuthenticationPrincipal CustomOauth2User oauth2User 로그인 구현 후 주석 해제 **/) {

        RepositoryListResponse response = repositoryService.getRepositoryList();

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[레포지토리]글 작성", description = "레포지토리 작성")
    //@PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<RepositoryResponse> registerRepository(
            @RequestBody @Valid RepositoryRequest request
            /**@AuthenticationPrincipal CustomOauth2User oauth2User 로그인 구현 후 주석 해제 **/) {

        RepositoryResponse response = repositoryService.registerRepository(request);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[레포지토리]글 수정", description = "레포지토리 수정")
    //@PreAuthorize("isAuthenticated()")
    @PatchMapping("/{repositoryId}")
    public ResponseEntity<RepositoryResponse> updateRepository(
            @PathVariable Long repositoryId,
            @RequestBody @Valid RepositoryRequest request
            /**@AuthenticationPrincipal CustomOauth2User oauth2User 로그인 구현 후 주석 해제 **/) {
        RepositoryResponse response = repositoryService.updateRepository(repositoryId, request);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[레포지토리]글 삭제", description = "레포지토리 삭제")
    //@PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{repositoryId}")
    public ResponseEntity<RepositoryResponse> deleteRepository(
            @PathVariable Long repositoryId
            /**@AuthenticationPrincipal CustomOauth2User oauth2User 로그인 구현 후 주석 해제 **/) {
        RepositoryResponse response = repositoryService.deleteRepository(repositoryId);

        return ResponseEntity.ok(response);
    }
}
