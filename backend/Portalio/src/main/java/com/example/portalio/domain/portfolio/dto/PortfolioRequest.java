package com.example.portalio.domain.portfolio.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class PortfolioRequest {

    @NotNull(message = "empty portfolio title")
    @Size(max = 50, message = "long title")
    private String portfolioTitle;

    @Size(max = 200, message = "Description too long")
    private String portfolioDescription;

    @NotNull(message = "empty portfolio content")
    private String portfolioContent;

    private String portfolioThumbnailImg;

    @NotNull(message = "empty Post")
    private Boolean portfolioPost;

    @NotNull(message = "empty portfolio job")
    private Long jobSubCategoryId;

    private Long memberId;
}
