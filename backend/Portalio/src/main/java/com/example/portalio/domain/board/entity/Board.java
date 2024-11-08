package com.example.portalio.domain.board.entity;

import static com.example.portalio.domain.board.enums.BoardRole.FREE;

import com.example.portalio.domain.board.enums.BoardRole;
import com.example.portalio.domain.boardcomment.entity.BoardComment;
import com.example.portalio.domain.common.entity.AuditableCreatedEntity;
import com.example.portalio.domain.member.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "board")
public class Board extends AuditableCreatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Long boardId;

    @Column(name = "board_category", nullable = false)
    private BoardRole boardCategory = FREE;

    @Column(name = "board_title", nullable = false, length = 50)
    private String boardTitle;

    @Column(name = "board_content", nullable = false, columnDefinition = "TEXT")
    private String boardContent;

    @Column(name = "board_img_key", nullable = false, columnDefinition = "TEXT")
    private String boardImgKey = "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png";

    @Column(name = "board_solve", nullable = false)
    private Boolean boardSolve = false;

    @Column(name = "board_views", nullable = false)
    private Integer boardViews = 0;

    @Column(name = "board_recommendation_count", nullable = false)
    private Integer boardRecommendationCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "board")
    private List<BoardComment> boardComments = new ArrayList<>();

    private Board(BoardRole boardCategory, String boardTitle, String boardContent, String boardImgKey, Member member) {
        this.boardCategory = boardCategory;
        this.boardTitle = boardTitle;
        this.boardContent = boardContent;
        this.boardImgKey = boardImgKey;
        this.member = member;
    }

    public static Board of(BoardRole boardCategory, String boardTitle, String boardContent, String boardImgKey, Member member) {
        return new Board(boardCategory, boardTitle, boardContent, boardImgKey, member);
    }

    public void setBoardCategory(BoardRole boardCategory) {
        this.boardCategory = boardCategory;
    }

    public void setBoardTitle(String boardTitle) {
        this.boardTitle = boardTitle;
    }

    public void setBoardContent(String boardContent) {
        this.boardContent = boardContent;
    }

    public void setBoardImgKey(String boardImgKey) { this.boardImgKey = boardImgKey; }

    public void setBoardSolve(Boolean boardSolve) { this.boardSolve = boardSolve; }

    public void setMember(Member member) { this.member = member; }

    public void setBoardRecommendationCount(Integer boardRecommendationCount) { this.boardRecommendationCount = boardRecommendationCount; }
}