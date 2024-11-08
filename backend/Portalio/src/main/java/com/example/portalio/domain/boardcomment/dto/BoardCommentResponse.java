package com.example.portalio.domain.boardcomment.dto;

import com.example.portalio.domain.boardcomment.entity.BoardComment;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BoardCommentResponse {

    private Long commentId;
    private String content;
    private Long boardId;
    private Long memberId;

    public static BoardCommentResponse from(BoardComment boardComment) {
        return BoardCommentResponse.builder()
                .commentId(boardComment.getBoardCommentId())
                .content(boardComment.getContent())
                .boardId(boardComment.getBoard().getBoardId())
                .memberId(boardComment.getMember().getMemberId())
                .build();
    }
}
