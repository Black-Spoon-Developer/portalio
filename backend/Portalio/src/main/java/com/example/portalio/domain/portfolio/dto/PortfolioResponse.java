package com.example.portalio.domain.portfolio.dto;

import com.example.portalio.domain.portfolio.entity.Portfolio;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PortfolioResponse {

    private Long portfolioId;
    private String portfolioTitle;
    private String portfolioContent;
    private Long portfolioJob;
    private Integer portfolioViews;
    private String portfolioThumbnailImg;
    private Integer portfolioRecommendationCount;
    private Boolean portfolioPost;
    private LocalDateTime created;
    private Long memberId;

    public static PortfolioResponse from(Portfolio portfolio) {
        return PortfolioResponse.builder()
                .portfolioId(portfolio.getPortfolioId())
                .portfolioTitle(portfolio.getPortfolioTitle())
                .portfolioContent(portfolio.getPortfolioContent())
                .portfolioJob(portfolio.getJobSubCategory().getJobId())
                .portfolioViews(portfolio.getPortfolioViews())
                .portfolioThumbnailImg(portfolio.getPortfolioThumbnailImg())
                .portfolioRecommendationCount(portfolio.getPortfolioRecommendationCount())
                .portfolioPost(portfolio.getPortfolioPost())
                .created(portfolio.getCreated())
                .memberId(portfolio.getMember().getMemberId())
                .build();
    }
}
