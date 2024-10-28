package com.example.portalio.domain.board.dto;

import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.board.enums.BoardRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BoardResponse {

    private Long boardId;
    private BoardRole boardCategory;
    private String boardTitle;
    private String boardContent;
    private Integer boardViews;
    private Long memberId;

    public static BoardResponse from(Board board) {
        return BoardResponse.builder()
                .boardId(board.getBoardId())
                .boardCategory(board.getBoardCategory())
                .boardTitle(board.getBoardTitle())
                .boardContent(board.getBoardContent())
                .boardViews(board.getBoardViews())
                .memberId(board.getMember().getMemberId())
                .build();
    }
}
