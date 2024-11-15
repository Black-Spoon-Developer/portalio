package com.example.portalio.domain.userdetail.dto;

public class TicketRankingResponse {
    private Long memberId;
    private int userTicket;

    public TicketRankingResponse(Long memberId, int userTicket) {
        this.memberId = memberId;
        this.userTicket = userTicket;
    }

    public Long getMemberId() {
        return memberId;
    }

    public int getUserTicket() {
        return userTicket;
    }
}
