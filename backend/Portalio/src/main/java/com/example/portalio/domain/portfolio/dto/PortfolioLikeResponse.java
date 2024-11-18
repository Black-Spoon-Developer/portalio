package com.example.portalio.domain.portfolio.dto;

import com.example.portalio.domain.portfolio.entity.Portfolio;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PortfolioLikeResponse {

    private Long portfolioId;
    private String portfolioTitle;
    private String portfolioDescription;
    private String portfolioContent;
    private Long portfolioJob;
    private Integer portfolioViews;
    private String portfolioThumbnailImg;
    private Integer portfolioRecommendationCount;
    private Boolean portfolioPost;
    private Boolean portfolioIsPrimary;
    private LocalDateTime created;
    private Integer portfolioCommentCount;
    private Long memberId;
    private String memberUsername;
    private String memberNickname;
    private String picture;
    private Boolean isLiked;

    public static PortfolioLikeResponse from(Portfolio portfolio, Boolean isLiked) {

        return PortfolioLikeResponse.builder()
                .portfolioId(portfolio.getPortfolioId())
                .portfolioTitle(portfolio.getPortfolioTitle())
                .portfolioDescription(portfolio.getPortfolioDescription())
                .portfolioContent(portfolio.getPortfolioContent())
                .portfolioJob(portfolio.getJobSubCategory().getJobId())
                .portfolioViews(portfolio.getPortfolioViews())
                .portfolioThumbnailImg(portfolio.getPortfolioThumbnailImg())
                .portfolioCommentCount(portfolio.getPortfolioComments().size())
                .portfolioRecommendationCount(portfolio.getPortfolioRecommendationCount())
                .portfolioPost(portfolio.getPortfolioPost())
                .portfolioIsPrimary(portfolio.getPortfolioIsPrimary())
                .created(portfolio.getCreated())
                .memberId(portfolio.getMember().getMemberId())
                .memberUsername(portfolio.getMember().getMemberUsername())
                .memberNickname(portfolio.getMember().getUserDetail().getUserNickname())
                .picture(portfolio.getMember().getMemberPicture())
                .isLiked(isLiked)
                .build();
    }
}
