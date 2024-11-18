package com.example.portalio.domain.jobhistory.repository;

import com.example.portalio.domain.jobhistory.entity.JobHistory;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobHistoryRepository extends JpaRepository<JobHistory, Long> {



    // 유저의 경력/이력 전체 조회
    List<JobHistory> findAllByMember_MemberUsername(String memberUsername);

    // 유저의 경력/이력 단일 조회
    Optional<JobHistory> findByJobHistoryId(Long jobHistoryId);
}
