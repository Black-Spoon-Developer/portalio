package com.example.portalio.domain.userdetail.dto;

import com.example.portalio.domain.userdetail.entity.UserDetail;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserIntroductionResponse {
    private String userIntroductionTitle;
    private String userIntroductionContent;

    public static UserIntroductionResponse from(UserDetail userDetail) {
        return UserIntroductionResponse.builder()
                .userIntroductionTitle(userDetail.getUserIntroductionTitle())
                .userIntroductionContent(userDetail.getUserIntroductionContent())
                .build();
    }
}
