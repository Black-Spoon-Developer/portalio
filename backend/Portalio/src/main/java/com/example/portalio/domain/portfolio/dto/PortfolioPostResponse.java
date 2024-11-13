package com.example.portalio.domain.portfolio.dto;

import com.example.portalio.domain.portfolio.entity.Portfolio;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PortfolioPostResponse {
    private Long portfolioId;
    private Long memberId;
    private Boolean portfolioPost;
    private Boolean portfolioIsPrimary;

    public static PortfolioPostResponse from(Portfolio portfolio) {
        return PortfolioPostResponse.builder()
                .portfolioId(portfolio.getPortfolioId())
                .memberId(portfolio.getMember().getMemberId())
                .portfolioPost(portfolio.getPortfolioPost())
                .portfolioIsPrimary(portfolio.getPortfolioIsPrimary())
                .build();
    }
}
