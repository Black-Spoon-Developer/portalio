package com.example.portalio.domain.userdetail.dto;


import com.example.portalio.domain.userdetail.entity.UserDetail;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserSocialLinkResponse {

    private String facebook;
    private String instagram;
    private String linkedin;
    private String github;

    public static UserSocialLinkResponse from(UserDetail userDetail) {
        return UserSocialLinkResponse.builder()
                .facebook(userDetail.getUserFacebook())
                .instagram(userDetail.getUserInstagram())
                .linkedin(userDetail.getUserLinkedin())
                .github(userDetail.getUserGithub())
                .build();
    }

}
