package com.example.portalio.domain.boardcomment.dto;

import com.example.portalio.domain.boardcomment.entity.BoardComment;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class BoardCommentListResponse {

    private final List<BoardCommentResponse> items;

    public static BoardCommentListResponse from(List<BoardComment> boardComments) {
        List<BoardCommentResponse> items = boardComments.stream()
                .map(BoardCommentResponse::from)
                .toList();

        return new BoardCommentListResponse(items);
    }
}
