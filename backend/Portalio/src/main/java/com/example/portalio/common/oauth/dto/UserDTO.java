package com.example.portalio.common.oauth.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
@Builder
public class UserDTO {
    private String role;
    private String name;
    private String username;
}
