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
    private Boolean boardSolve;
    private Integer boardViews;
    private String boardThumbnailImg;
    private Integer boardRecommendationCount;
    private Integer boardCommentCount;
    private LocalDateTime created;
    private Long memberId;
    private String memberUsername;

    public static BoardResponse from(Board board) {
        return BoardResponse.builder()
                .boardId(board.getBoardId())
                .boardCategory(board.getBoardCategory())
                .boardTitle(board.getBoardTitle())
                .boardContent(board.getBoardContent())
                .boardSolve(board.getBoardSolve())
                .boardViews(board.getBoardViews())
                .boardThumbnailImg(board.getBoardThumbnailImg())
                .boardRecommendationCount(board.getBoardRecommendationCount())
                .boardCommentCount(board.getBoardComments().size())
                .created(board.getCreated())
                .memberId(board.getMember().getMemberId())
                .memberUsername(board.getMember().getMemberUsername())
                .build();
    }
}
