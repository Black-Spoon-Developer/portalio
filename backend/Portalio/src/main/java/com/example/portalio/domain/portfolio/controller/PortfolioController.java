package com.example.portalio.domain.portfolio.controller;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.portfolio.dto.PortfolioLikeListResponse;
import com.example.portalio.domain.portfolio.dto.PortfolioLikeResponse;
import com.example.portalio.domain.portfolio.dto.PortfolioListResponse;
import com.example.portalio.domain.portfolio.dto.PortfolioPostResponse;
import com.example.portalio.domain.portfolio.dto.PortfolioRequest;
import com.example.portalio.domain.portfolio.dto.PortfolioResponse;
import com.example.portalio.domain.portfolio.entity.Portfolio;
import com.example.portalio.domain.portfolio.service.PortfolioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
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
@RequestMapping("/api/v1/portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;

    @Operation(summary = "[포트폴리오]글 검색", description = "jobId, boardTitle을 사용해 글 검색")
    @GetMapping
    public ResponseEntity<PortfolioLikeListResponse> getPortfolioSearch(
            @RequestParam Long portfolioJob,
            @RequestParam String portfolioTitle,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        PortfolioLikeListResponse response = portfolioService.getPortfolioSearch(portfolioJob, portfolioTitle, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오]글 상세보기", description = "portfolios_id 입력")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{portfoliosId}")
    public ResponseEntity<PortfolioLikeResponse> getPortfoliosDetail(
            @PathVariable("portfoliosId") Long portfoliosId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {
        PortfolioLikeResponse response = portfolioService.getPortfolioDetails(portfoliosId, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오]글 전체보기(리스트)", description = "무한스크롤, 사용시 skip을 10씩 증가해서 넣으세요, limit 10 고정, Post(게시)가 ture인 것만 반환")
    @GetMapping("/all")
    public ResponseEntity<PortfolioLikeListResponse> getPortfoliosList(
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        PortfolioLikeListResponse response = portfolioService.getPortfolioList(skip, limit, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오]글 전체보기(내가 쓴 글만)", description = "페이지네이션")
    @GetMapping("/my/{username}")
    public ResponseEntity<PortfolioListResponse> getMyPortfoliosList(
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit,
            @PathVariable String username) {

        PortfolioListResponse response = portfolioService.getMyPortfolioList(skip, limit, username);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오]글 작성", description = "글 작성")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<PortfolioResponse> registerPortfolio(
            @RequestBody @Valid PortfolioRequest request,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        PortfolioResponse response = portfolioService.registerPortfolio(request, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오]글 수정", description = "글 수정")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{portfoliosId}")
    public ResponseEntity<PortfolioResponse> updatePortfolio(
            @PathVariable Long portfoliosId,
            @RequestBody @Valid PortfolioRequest request,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        PortfolioResponse response = portfolioService.updatePortfolio(portfoliosId, request, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오]글 삭제", description = "글 삭제")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{portfoliosId}")
    public ResponseEntity<PortfolioResponse> deletePortfolio(
            @PathVariable Long portfoliosId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        PortfolioResponse response = portfolioService.deletePortfolio(portfoliosId, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오] 게시하기", description = "포르폴리오 게시")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{portfoliosId}/post")
    public ResponseEntity<PortfolioPostResponse> postPortfolio(
            @PathVariable Long portfoliosId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        PortfolioPostResponse response = portfolioService.postPortfolio(portfoliosId, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오] 대표설정하기", description = "포르폴리오 대표설정")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{portfoliosId}/primary")
    public ResponseEntity<PortfolioPostResponse> primaryPortfolio(
            @PathVariable Long portfoliosId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        PortfolioPostResponse response = portfolioService.primaryPortfolio(portfoliosId, oauth2User);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오] 인기 포트폴리오", description = "인기 포트폴리오 불러오기")
    @GetMapping("/popular/top10")
    public ResponseEntity<PortfolioListResponse> getTop10Portfolios() {

        PortfolioListResponse response = portfolioService.getTop10Portfolios();

        return ResponseEntity.ok(response);
    }
}
