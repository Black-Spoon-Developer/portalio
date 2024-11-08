package com.example.portalio.domain.portfoliocomment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class PortfolioCommentRequest {

    @NotNull(message = "empty content")
    private String content;
}
