package com.example.portalio.domain.portfoliocomment.dto;

import com.example.portalio.domain.portfoliocomment.entity.PortfolioComment;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PortfolioCommentResponse {

    private Long portfolioCommentId;
    private String content;
    private Long portfolioId;
    private Long memberId;

    public static PortfolioCommentResponse from(PortfolioComment portfolioComment) {
        return PortfolioCommentResponse.builder()
                .portfolioCommentId(portfolioComment.getPortfolioCommentId())
                .content(portfolioComment.getContent())
                .portfolioId(portfolioComment.getPortfolio().getPortfolioId())
                .memberId(portfolioComment.getMember().getMemberId())
                .build();
    }
}
