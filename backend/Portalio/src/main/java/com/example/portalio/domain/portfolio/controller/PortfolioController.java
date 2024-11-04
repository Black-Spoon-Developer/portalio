package com.example.portalio.domain.portfolio.controller;

import com.example.portalio.domain.board.dto.BoardListResponse;
import com.example.portalio.domain.board.dto.BoardRequest;
import com.example.portalio.domain.board.dto.BoardResponse;
import com.example.portalio.domain.portfolio.dto.PortfolioListResponse;
import com.example.portalio.domain.portfolio.dto.PortfolioPostResponse;
import com.example.portalio.domain.portfolio.dto.PortfolioRequest;
import com.example.portalio.domain.portfolio.dto.PortfolioResponse;
import com.example.portalio.domain.portfolio.service.PortfolioService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    @Operation(summary = "[포트폴리오]글 검색", description = "jobId, boardTitle을 사용해 글 검색")
    @GetMapping
    public ResponseEntity<PortfolioListResponse> getPortfolioSearch(
            @RequestParam(required = false) Integer portfolioJob,
            @RequestParam(required = false) String portfolioTitle) {

        PortfolioListResponse response = portfolioService.getPortfolioSearch(portfolioJob, portfolioTitle);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오]글 상세보기", description = "portfolios_id 입력")
    @GetMapping("/{portfoliosId}")
    public ResponseEntity<PortfolioResponse> getPortfoliosDetail(@PathVariable("portfoliosId") Long portfoliosId) {

        PortfolioResponse response = portfolioService.getPortfolioDetails(portfoliosId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오]글 전체보기(리스트)", description = "무한스크롤, 사용시 skip을 10씩 증가해서 넣으세요, limit 10 고정")
    @GetMapping("/all")
    public ResponseEntity<PortfolioListResponse> getPortfoliosList(
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit) {

        PortfolioListResponse response = portfolioService.getPortfolioList(skip, limit);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오]글 작성", description = "글 작성")
    //@PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<PortfolioResponse> registerPortfolio(
            @RequestBody @Valid PortfolioRequest request
            /**@AuthenticationPrincipal CustomOauth2User oauth2User 로그인 구현 후 주석 해제 **/) {

        PortfolioResponse response = portfolioService.registerPortfolio(request);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오]글 수정", description = "글 수정")
//    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{portfoliosId}")
    public ResponseEntity<PortfolioResponse> updatePortfolio(
            @PathVariable Long portfoliosId,
            @RequestBody @Valid PortfolioRequest request
            /**@AuthenticationPrincipal CustomOauth2User oauth2User 로그인 구현 후 주석 해제 **/) {
        PortfolioResponse response = portfolioService.updatePortfolio(portfoliosId, request);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오]글 삭제", description = "글 삭제")
//    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{portfoliosId}")
    public ResponseEntity<PortfolioResponse> deletePortfolio(
            @PathVariable Long portfoliosId
            /**@AuthenticationPrincipal CustomOauth2User oauth2User 로그인 구현 후 주석 해제 **/) {
        PortfolioResponse response = portfolioService.deletePortfolio(portfoliosId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[포트폴리오] 게시하기", description = "포르폴리오 게시")
    //    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{portfoliosId}/post")
    public ResponseEntity<PortfolioPostResponse> postPortfolio(
            @PathVariable Long portfoliosId
            /**@AuthenticationPrincipal CustomOauth2User oauth2User 로그인 구현 후 주석 해제 **/) {

        PortfolioPostResponse response = portfolioService.postPortfolio(portfoliosId);

        return ResponseEntity.ok(response);
    }
}
