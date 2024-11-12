package com.example.portalio.domain.portfoliorecom.dto;

import com.example.portalio.domain.portfolio.entity.Portfolio;
import com.example.portalio.domain.portfoliorecom.entity.PortfolioRecom;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PortfolioRecomResponse {

    private Long portfolioRecomId;
    private Long memberId;
    private Long portfolioId;
    private String message;
    
    // 추천 취소를 했을때의 반환해주기 위한 정적 메서드
    public static PortfolioRecomResponse cancel() {
        return PortfolioRecomResponse.builder()
                .portfolioRecomId(null)
                .memberId(null)
                .portfolioId(null)
                .message("추천이 취소 되었습니다.")
                .build();
    }
    
    
    public static PortfolioRecomResponse from(PortfolioRecom portfolioRecom) {
        return PortfolioRecomResponse.builder()
                .portfolioRecomId(portfolioRecom.getPortfolioRecomId())
                .memberId(portfolioRecom.getMember().getMemberId())
                .portfolioId(portfolioRecom.getPortfolio().getPortfolioId())
                .message("추천에 성공했습니다.")
                .build();
    }
}
