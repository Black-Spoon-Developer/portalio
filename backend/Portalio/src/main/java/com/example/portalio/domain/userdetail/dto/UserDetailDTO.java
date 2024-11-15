package com.example.portalio.domain.userdetail.dto;

import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.userdetail.entity.UserDetail;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailDTO {
    private Long memberId;
    private String userNickname;
    private String userEmail;
    private Integer userTicket;


    // UserDetail 엔티티를 DTO로 변환하는 정적 메서드
    public static UserDetailDTO from(UserDetail userDetail) {
        return UserDetailDTO.builder()
                .memberId(userDetail.getMemberId())
                .userNickname(userDetail.getUserNickname())
                .userEmail(userDetail.getUserEmail())
                .userTicket(userDetail.getUserTicket())
                .build();
    }

}
