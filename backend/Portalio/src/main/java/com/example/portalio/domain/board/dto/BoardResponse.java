package com.example.portalio.domain.board.dto;

import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.board.enums.BoardRole;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BoardResponse {

    private Long boardId;
    private BoardRole boardCategory;
    private String boardTitle;
    private String boardContent;
    private String boardImgKey;
    private Boolean boardSolve;
    private Integer boardViews;
    private Integer boardRecommendationCount;
    private LocalDateTime created;
//    private String nickname;
    private Long memberId;

    public static BoardResponse from(Board board) {
        return BoardResponse.builder()
                .boardId(board.getBoardId())
                .boardCategory(board.getBoardCategory())
                .boardTitle(board.getBoardTitle())
                .boardContent(board.getBoardContent())
                .boardImgKey(board.getBoardImgKey())
                .boardSolve(board.getBoardSolve())
                .boardViews(board.getBoardViews())
                .boardRecommendationCount(board.getBoardRecommendationCount())
                .created(board.getCreated())
//                .nickname(board.getMember().getMemberNickname())
                .memberId(board.getMember().getMemberId())
                .build();
    }
}
