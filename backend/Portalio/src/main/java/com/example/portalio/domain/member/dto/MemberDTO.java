package com.example.portalio.domain.member.dto;

import com.example.portalio.common.jwt.entity.RefreshEntity;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.enums.Role;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDTO {

    private Long memberId;
    private String memberName;
    private String memberUsername;
    private String memberNickname;
    private String refreshToken;
    private String memberPicture;
    private Role memberRole;
    private int memberTicket;
    private boolean memberAuth;

    public static MemberDTO from(Member member) {
        RefreshEntity refreshToken = member.getRefreshToken();

        if (refreshToken != null) {
            MemberDTO memberDTO = MemberDTO.builder()
                    .memberId(member.getMemberId())
                    .memberName(member.getMemberName())
                    .memberNickname(member.getUserDetail().getUserNickname())
                    .refreshToken(member.getRefreshToken().getValue())
                    .memberUsername(member.getMemberUsername())
                    .memberPicture(member.getMemberPicture())
                    .memberRole(member.getMemberRole())
                    .memberTicket(member.getUserDetail().getUserTicket())
                    .memberAuth(member.isMemberAuth())
                    .build();

            return memberDTO;
        } else {
            MemberDTO memberDTO = MemberDTO.builder()
                    .memberId(member.getMemberId())
                    .memberName(member.getMemberName())
                    .memberUsername(member.getMemberUsername())
                    .memberPicture(member.getMemberPicture())
                    .memberRole(member.getMemberRole())
                    .memberAuth(member.isMemberAuth())
                    .build();

            return memberDTO;
        }
    }
}
