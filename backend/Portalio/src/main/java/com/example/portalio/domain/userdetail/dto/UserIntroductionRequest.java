package com.example.portalio.domain.userdetail.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Getter
@NoArgsConstructor
public class UserIntroductionRequest {
    private String userIntroductionTitle;
    private String userIntroductionContent;
}
