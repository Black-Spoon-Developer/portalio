package com.example.portalio.domain.member.dto;

import com.example.portalio.domain.member.enums.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MemberRequestDTO {

    private String memberName;
    private String memberNickname;
    private String memberUsername;
    private String memberPicture;
    private String memberEmail;
    private Role memberRole;

}
