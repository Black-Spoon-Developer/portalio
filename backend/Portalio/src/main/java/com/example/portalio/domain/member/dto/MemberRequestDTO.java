package com.example.portalio.domain.member.dto;

import com.example.portalio.domain.member.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberRequestDTO {

    private String memberName;
    private String memberNickname;
    private String memberUsername;
    private String memberPicture;
    private String memberEmail;
    private Role memberRole;

}
