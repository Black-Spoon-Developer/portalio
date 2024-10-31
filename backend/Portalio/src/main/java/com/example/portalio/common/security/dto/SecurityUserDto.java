package com.example.portalio.common.security.dto;

import lombok.*;

@NoArgsConstructor
@Getter
@ToString
@AllArgsConstructor
@Builder
public class SecurityUserDto {
    private String email;
    private String nickname;
    private String picture;
    private String role;
    private Integer memberNo;

}
