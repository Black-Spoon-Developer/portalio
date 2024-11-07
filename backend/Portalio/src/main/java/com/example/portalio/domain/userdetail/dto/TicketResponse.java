package com.example.portalio.domain.userdetail.dto;

import com.example.portalio.domain.userdetail.entity.UserDetail;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TicketResponse {
    private Long memberId;
    private Integer userTicket;

    public static TicketResponse from(UserDetail userDetail) {
        return TicketResponse.builder()
                .memberId(userDetail.getMemberId())
                .userTicket(userDetail.getUserTicket())
                .build();
    }
}
