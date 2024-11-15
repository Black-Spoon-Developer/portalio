package com.example.portalio.domain.userdetail.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class UserDetailRequest {
    private String memberId;
    private String memberNickname;

}
