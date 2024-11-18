package com.example.portalio.domain.member.dto;

import com.example.portalio.domain.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberPictureDTO {

    private String memberPicture;

    public static MemberPictureDTO from(Member member) {
        return MemberPictureDTO.builder()
                .memberPicture(member.getMemberPicture())
                .build();
    }
}