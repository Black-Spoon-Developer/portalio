package com.example.portalio.domain.board.repository;

import com.example.portalio.domain.board.entity.Board;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query("SELECT b FROM Board b LEFT JOIN b. br " +
            "WHERE b.createdDate >= :oneWeekAgo " +
            "GROUP BY b " +
            "ORDER BY COUNT(br) DESC")
    List<Board> findTop10ByCreatedDateAfterOrderByRecommendationCount(
            @Param("oneWeekAgo") LocalDateTime oneWeekAgo);

    List<Board> findTop10ByCreatedDateDesc();

}
