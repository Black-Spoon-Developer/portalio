package com.example.portalio.domain.board.dto;

import com.example.portalio.domain.board.entity.Board;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class BoardLikeListResponse {

    private final List<BoardLikeResponse> items;

    public static BoardLikeListResponse from(List<Board> boards, Map<Long, Boolean> likeStatusMap) {
        List<BoardLikeResponse> items = boards.stream()
                .map(board -> BoardLikeResponse.from(
                        board, likeStatusMap.getOrDefault(board.getBoardId(), false)))
                .collect(Collectors.toList());
        return new BoardLikeListResponse(items);
    }
}
