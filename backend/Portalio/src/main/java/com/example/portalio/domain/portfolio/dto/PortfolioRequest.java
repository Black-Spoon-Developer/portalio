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

    @NotNull(message = "empty portfolio content")
    private String portfolioContent;

    private String portfolioImgKey;

    private String portfolioFileKey;

    @NotNull(message = "empty portfolio thumbnail img")
    private String portfolioThumbnailImg;

//    @NotNull(message = "empty member id")
//    private Long memberId;

    @NotNull(message = "empty portfolio job")
    private Long jobSubCategoryId;

}
