package com.example.portalio.domain.portfolio.dto;

import com.example.portalio.domain.member.dto.MemberDTO;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.portfolio.entity.Portfolio;
import com.example.portalio.domain.portfoliorecom.entity.PortfolioRecom;
import java.time.LocalDateTime;
import java.util.List;
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
    private Integer portfolioCommentCount;
    
    // 작성자 정보
    private MemberDTO authorInfo;

    // 좋아요(추천)한 유저들의 정보


    public static PortfolioResponse from(Portfolio portfolio) {

        return PortfolioResponse.builder()
                .portfolioId(portfolio.getPortfolioId())
                .portfolioTitle(portfolio.getPortfolioTitle())
                .portfolioContent(portfolio.getPortfolioContent())
                .portfolioJob(portfolio.getJobSubCategory().getJobId())
                .portfolioViews(portfolio.getPortfolioViews())
                .portfolioThumbnailImg(portfolio.getPortfolioThumbnailImg())
                .portfolioCommentCount(portfolio.getPortfolioComments().size())
                .portfolioRecommendationCount(portfolio.getPortfolioRecommendationCount())
                .portfolioPost(portfolio.getPortfolioPost())
                .created(portfolio.getCreated())
                .authorInfo(MemberDTO.from(portfolio.getMember()))
                .build();
    }
}
