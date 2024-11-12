package com.example.portalio.domain.boardrecom.dto;

import com.example.portalio.domain.boardrecom.entity.BoardRecom;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BoardRecomResponse {
    private Long recomId;
    private Long memberId;
    private Long boardId;

    public static BoardRecomResponse cancel(BoardRecom boardRecom) {
        return BoardRecomResponse.builder()
                .recomId(boardRecom.getRecomId())
                .memberId(boardRecom.getMember().getMemberId())
                .boardId(boardRecom.getBoard().getBoardId())
                .build();
    }

    public static BoardRecomResponse from(BoardRecom boardRecom) {
        return BoardRecomResponse.builder()
                .recomId(boardRecom.getRecomId())
                .memberId(boardRecom.getMember().getMemberId())
                .boardId(boardRecom.getBoard().getBoardId())
                .build();
    }

}
