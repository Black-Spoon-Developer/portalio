package com.example.portalio.common.oauth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Long memberId;
    private String name;
    private String username;
    private String role;
    private String picture;
    private boolean isNewUser;

    public void setMemberId(Long memberId) { this.memberId = memberId;}

    public void setName(String name) {
        this.name = name;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public void setIsNewUser(boolean isNewUser) {
        this.isNewUser = isNewUser;
    }

}
