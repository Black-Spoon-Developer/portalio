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

    @Query("SELECT a FROM ActivityBoard a WHERE ( :activityBoardTitle IS NULL OR LOWER(a.activityBoardTitle) LIKE LOWER(concat('%', :activityBoardTitle, '%')))")
    List<ActivityBoard> findByActivityBoardTitle(@Param("activityBoardTitle") String activityBoardTitle);

    List<ActivityBoard> findAllByOrderByCreatedDesc(Pageable pageable);

    List<ActivityBoard> findAllByRepository_RepositoryId(Long repositoryId);

    @Query("SELECT ab FROM ActivityBoard ab JOIN ab.repository r JOIN r.member m WHERE m.memberUsername = :username")
    List<ActivityBoard> findByMemberUsername(@Param("username") String username, Pageable pageable);

    Optional<ActivityBoard> findByActivityBoardIdAndRepository_RepositoryId(Long activityBoardId, Long repositoryId);
}
