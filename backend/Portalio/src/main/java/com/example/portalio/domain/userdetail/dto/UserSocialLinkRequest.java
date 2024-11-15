package com.example.portalio.domain.userdetail.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class UserSocialLinkRequest {
    private String facebook;
    private String instagram;
    private String linkedin;
    private String github;
}
