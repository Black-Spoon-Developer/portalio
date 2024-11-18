package com.example.portalio.domain.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateMemberPictureDTO {
    private String memberPicture; // 새로운 프로필 사진 URL
}
