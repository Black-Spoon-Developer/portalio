package com.example.portalio.domain.portfolio.dto;

import com.example.portalio.domain.portfolio.entity.Portfolio;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PortfolioListResponse {

    private final List<PortfolioResponse> items;

    public static PortfolioListResponse from(List<Portfolio> portfolios) {
        List<PortfolioResponse> items = portfolios.stream()
                .map(PortfolioResponse::from)
                .toList();

        return new PortfolioListResponse(items);
    }
}
