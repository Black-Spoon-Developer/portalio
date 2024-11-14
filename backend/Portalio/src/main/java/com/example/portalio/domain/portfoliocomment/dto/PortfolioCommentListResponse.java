package com.example.portalio.domain.portfoliocomment.dto;

import com.example.portalio.domain.portfoliocomment.entity.PortfolioComment;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PortfolioCommentListResponse {

    private final List<PortfolioCommentResponse> items;

    public static PortfolioCommentListResponse from(List<PortfolioComment> portfolioComments) {
        List<PortfolioCommentResponse> items = portfolioComments.stream()
                .map(PortfolioCommentResponse::from)
                .toList();

        return new PortfolioCommentListResponse(items);
    }
}
