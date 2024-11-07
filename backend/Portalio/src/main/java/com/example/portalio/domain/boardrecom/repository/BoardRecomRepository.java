package com.example.portalio.domain.boardrecom.repository;

import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.boardrecom.entity.BoardRecom;
import com.example.portalio.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRecomRepository extends JpaRepository<BoardRecom, Long> {

    Boolean existsByMemberAndBoard(Member member, Board board);

}
