package com.example.portalio.domain.board.dto;

import com.example.portalio.domain.board.entity.Board;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BoardSolveResponse {
    private Long boardId;
    private Long memberId;
    private Boolean boardSolve;

    public static BoardSolveResponse from(Board board) {
        return BoardSolveResponse.builder()
                .boardId(board.getBoardId())
                .memberId(board.getMember().getMemberId())
                .boardSolve(board.getBoardSolve())
                .build();
    }
}
