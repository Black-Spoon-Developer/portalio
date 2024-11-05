package com.example.portalio.domain.activityboard.repisotory;

import com.example.portalio.domain.activityboard.entity.ActivityBoard;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityBoardRepository extends JpaRepository<ActivityBoard, Long> {

    @Query("SELECT a FROM ActivityBoard a WHERE ( :activityBoardTitle IS NULL OR LOWER(a.activityBoardTitle) LIKE LOWER(concat('%', :activityBoardTitle, '%'))) AND a.activityBoardPost = true")
    List<ActivityBoard> findByActivityBoardTitle(@Param("activityBoardTitle") String activityBoardTitle);

    List<ActivityBoard> findAllByActivityBoardPostTrueOrderByCreatedDesc(Pageable pageable);

    Optional<ActivityBoard> findByActivityBoardId(Long activityBoardId);
}
