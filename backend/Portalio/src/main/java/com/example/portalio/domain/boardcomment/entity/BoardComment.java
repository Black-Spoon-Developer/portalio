package com.example.portalio.domain.boardcomment.entity;

import com.example.portalio.domain.board.entity.Board;
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
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "board_comment")
public class BoardComment extends AuditableCreatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_comment_id")
    private Long boardCommentId;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private BoardComment(String content) {
        this.content = content;
    }

    public static BoardComment from(String content) {
        return new BoardComment(content);
    }

    public void addRelation(Board board, Member member) {
        if (this.board != null) {
            this.board.getBoardComments().remove(this);
        }
        this.board = board;
        board.getBoardComments().add(this);

        if (this.member != null) {
            this.member.getBoardComments().remove(this);
        }
        this.member = member;
        member.getBoardComments().add(this);
    }

    public void setContent(String content) {
        this.content = content;
    }
}
