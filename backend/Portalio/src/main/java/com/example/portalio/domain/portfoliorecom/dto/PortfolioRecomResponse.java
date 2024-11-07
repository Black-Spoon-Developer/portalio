package com.example.portalio.domain.portfoliorecom.dto;

import com.example.portalio.domain.portfoliorecom.entity.PortfolioRecom;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PortfolioRecomResponse {

    private Long portfolioRecomId;
    private Long memberId;
    private Long portfolioId;

    public static PortfolioRecomResponse from(PortfolioRecom portfolioRecom) {
        return PortfolioRecomResponse.builder()
                .portfolioRecomId(portfolioRecom.getPortfolioRecomId())
                .memberId(portfolioRecom.getMember().getMemberId())
                .portfolioId(portfolioRecom.getPortfolio().getPortfolioId())
                .build();
    }
}
