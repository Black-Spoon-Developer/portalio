package com.example.portalio.domain.member.dto;

import com.example.portalio.domain.member.enums.Role;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDTO {

    private String memberName;
    private String memberUsername;
    private String memberPicture;
    private String memberEmail;
    private Role memberRole;

}
