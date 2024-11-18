package com.example.portalio.domain.boardcomment.repository;

import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.boardcomment.entity.BoardComment;
import com.example.portalio.domain.member.entity.Member;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardCommentRepository extends JpaRepository<BoardComment, Long> {

    List<BoardComment> findAllByBoard(Board board);

    Optional<BoardComment> findByBoardAndMemberAndBoardCommentId(Board board, Member member, Long commentId);
}
