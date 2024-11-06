package com.example.portalio.domain.portfolio.repository;

import com.example.portalio.domain.portfolio.entity.Portfolio;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    @Query("SELECT p FROM Portfolio p WHERE p.jobSubCategory.jobId = :jobId AND p.portfolioTitle LIKE %:portfolioTitle% AND p.portfolioPost = true")
    List<Portfolio> findByJobSubCategoryJobIdAndPortfolioTitle(@Param("jobId") Long jobId, @Param("portfolioTitle") String portfolioTitle);

    List<Portfolio> findAllByPortfolioPostTrueOrderByCreatedDesc(Pageable pageable);

    List<Portfolio> findAllByMember_MemberIdOrderByCreatedDesc(Long memberId, Pageable pageable);

    Optional<Portfolio> findByPortfolioIdAndMember_MemberId(Long portfolioId, Long memberId);
}
