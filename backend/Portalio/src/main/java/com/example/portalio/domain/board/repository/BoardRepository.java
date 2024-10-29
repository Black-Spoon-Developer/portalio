package com.example.portalio.domain.board.repository;

import com.example.portalio.domain.board.entity.Board;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query("SELECT b FROM Board b WHERE (:nickname IS NULL OR b.member.memberNickname = :nickname) AND (:boardTitle IS NULL OR b.boardTitle LIKE %:boardTitle%)")
    List<Board> findByNicknameAndBoardTitle(@Param("nickname") String nickname,@Param("boardTitle") String boardTitle);

    List<Board> findAllByOrderByCreatedDesc(Pageable pageable);

    Optional<Board> findByBoardId(Long boardId);

}
