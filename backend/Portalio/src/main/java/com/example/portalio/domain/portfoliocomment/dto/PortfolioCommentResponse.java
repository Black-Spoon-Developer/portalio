package com.example.portalio.domain.portfoliocomment.dto;

import com.example.portalio.domain.portfoliocomment.entity.PortfolioComment;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PortfolioCommentResponse {

    private Long portfolioCommentId;
    private Long portfolioId;
    private String content;
    private Long memberId;
    private String memberNickname;
    private String memberPicture;
    private LocalDateTime created;

    public static PortfolioCommentResponse from(PortfolioComment portfolioComment) {
        return PortfolioCommentResponse.builder()
                .portfolioCommentId(portfolioComment.getPortfolioCommentId())
                .content(portfolioComment.getContent())
                .portfolioId(portfolioComment.getPortfolio().getPortfolioId())
                .memberId(portfolioComment.getMember().getMemberId())
                .memberPicture(portfolioComment.getMember().getMemberPicture())
                .memberNickname(portfolioComment.getMember().getUserDetail().getUserNickname())
                .created(portfolioComment.getCreated())
                .build();
    }
}
