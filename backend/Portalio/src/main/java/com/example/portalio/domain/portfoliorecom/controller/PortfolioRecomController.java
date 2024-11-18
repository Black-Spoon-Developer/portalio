package com.example.portalio.domain.portfoliorecom.controller;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.portfoliorecom.dto.PortfolioRecomResponse;
import com.example.portalio.domain.portfoliorecom.service.PortfolioRecomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/portfolios")
public class PortfolioRecomController {

    private final PortfolioRecomService portfolioRecomService;

    @Operation(summary = "[포트폴리오]게시글 추천", description = "게시글 추천")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{portfoliosId}/recom")
    public ResponseEntity<PortfolioRecomResponse> PortfolioRecom(
            @PathVariable Long portfoliosId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        PortfolioRecomResponse response = portfolioRecomService.portfolioRecom(portfoliosId, oauth2User);

        return ResponseEntity.ok(response);
    }
}
