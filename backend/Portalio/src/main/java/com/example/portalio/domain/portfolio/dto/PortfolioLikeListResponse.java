package com.example.portalio.domain.portfolio.dto;

import com.example.portalio.domain.portfolio.entity.Portfolio;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PortfolioLikeListResponse {

    private final List<PortfolioLikeResponse> items;

    public static PortfolioLikeListResponse from(List<Portfolio> portfolios, Map<Long, Boolean> likeStatusMap) {
        List<PortfolioLikeResponse> items = portfolios.stream()
                .map(portfolio -> PortfolioLikeResponse.from(portfolio, likeStatusMap.getOrDefault(portfolio.getPortfolioId(), false)))
                .collect(Collectors.toList());
        return new PortfolioLikeListResponse(items);
    }
}
