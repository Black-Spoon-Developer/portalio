package com.example.portalio.domain.board.repository;

import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.board.enums.BoardRole;
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

    @Query("SELECT b FROM Board b WHERE (:boardTitle IS NULL OR LOWER(b.boardTitle) LIKE LOWER(concat('%', :boardTitle, '%'))) AND (:boardCategory IS NULL OR b.boardCategory = :boardCategory)")
    List<Board> findByBoardTitleAndCategory(@Param("boardTitle") String boardTitle, @Param("boardCategory") BoardRole boardCategory);

    List<Board> findAllByMember_MemberIdAndBoardCategoryOrderByCreatedDesc(Long memberId, BoardRole boardCategory, Pageable pageable);

    List<Board> findAllByMember_MemberIdOrderByCreatedDesc(Long memberId, Pageable pageable);

    Optional<Board> findByBoardIdAndMember_MemberId(Long boardId, Long memberId);

    List<Board> findByBoardCategoryOrderByCreatedDesc(BoardRole boardCategory, Pageable pageable);
}
