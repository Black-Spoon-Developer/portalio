package com.example.portalio.domain.board.dto;

import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.board.enums.BoardRole;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BoardLikeResponse {
    private Long boardId;
    private BoardRole boardCategory;
    private String boardTitle;
    private String boardContent;
    private Boolean boardSolve;
    private Integer boardViews;
    private Integer boardRecommendationCount;
    private LocalDateTime created;
    private Long memberId;
    private String memberNickname;
    private String picture;
    private Boolean isLiked;

    public static BoardLikeResponse from(Board board, Boolean isLiked) {
        return BoardLikeResponse.builder()
                .boardId(board.getBoardId())
                .boardCategory(board.getBoardCategory())
                .boardTitle(board.getBoardTitle())
                .boardContent(board.getBoardContent())
                .boardSolve(board.getBoardSolve())
                .boardViews(board.getBoardViews())
                .boardRecommendationCount(board.getBoardRecommendationCount())
                .created(board.getCreated())
                .memberId(board.getMember().getMemberId())
                .memberNickname(board.getMember().getUserDetail().getUserNickname())
                .picture(board.getMember().getMemberPicture())
                .isLiked(isLiked)
                .build();
    }
}