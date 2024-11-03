package com.example.portalio.common.oauth.dto;


import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String name;
    private String username;
    private String role;
    private boolean isNewUser;
}
