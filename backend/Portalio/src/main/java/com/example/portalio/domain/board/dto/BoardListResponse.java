package com.example.portalio.domain.board.dto;

import com.example.portalio.domain.board.entity.Board;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class BoardListResponse {

    private final List<BoardResponse> items;

    public static BoardListResponse from(List<Board> boards) {
        List<BoardResponse> items = boards.stream()
                .map(BoardResponse::from)
                .toList();

        return new BoardListResponse(items);
    }
}
