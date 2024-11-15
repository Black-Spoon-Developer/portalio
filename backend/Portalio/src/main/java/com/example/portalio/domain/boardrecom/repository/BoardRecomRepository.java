package com.example.portalio.domain.boardrecom.repository;

import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.boardrecom.entity.BoardRecom;
import com.example.portalio.domain.member.entity.Member;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRecomRepository extends JpaRepository<BoardRecom, Long> {

    Boolean existsByMemberAndBoard(Member member, Board board);

    List<BoardRecom>  findAllByMemberAndBoardIn(Member member, List<Board> board);

    Optional<BoardRecom> findByMemberAndBoard(Member member, Board board);
}
