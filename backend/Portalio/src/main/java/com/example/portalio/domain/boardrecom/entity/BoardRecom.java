package com.example.portalio.domain.boardrecom.entity;

import com.example.portalio.domain.board.entity.Board;
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
@Table(name = "board_recom")
public class BoardRecom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recom_id")
    private Long recomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;

    private BoardRecom(Member member, Board board) {
        this.member = member;
        this.board = board;
    }

    public static BoardRecom of(Member member, Board board) {
        return new BoardRecom(member, board);
    }
}
