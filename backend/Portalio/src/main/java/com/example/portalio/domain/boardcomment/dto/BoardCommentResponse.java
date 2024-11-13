package com.example.portalio.domain.boardcomment.dto;

import com.example.portalio.domain.boardcomment.entity.BoardComment;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BoardCommentResponse {

    private Long commentId;
    private String content;
    private Long boardId;
    private Long memberId;
    private String memberNickname;
    private String picture;
    private LocalDateTime created;

    public static BoardCommentResponse from(BoardComment boardComment) {
        return BoardCommentResponse.builder()
                .commentId(boardComment.getBoardCommentId())
                .content(boardComment.getContent())
                .boardId(boardComment.getBoard().getBoardId())
                .memberId(boardComment.getMember().getMemberId())
                .memberNickname(boardComment.getMember().getUserDetail().getUserNickname())
                .picture(boardComment.getMember().getMemberPicture())
                .created(boardComment.getCreated())
                .build();
    }
}
