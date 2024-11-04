package com.example.portalio.domain.portfolio.repository;

import com.example.portalio.domain.portfolio.entity.Portfolio;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    List<Portfolio> findByPortfolioJobAndPortfolioTitle(Integer portfolioJob, String title);

    List<Portfolio> findAllByOrderByCreatedDesc(Pageable pageable);

    Optional<Portfolio> findByPortfolioId(Long portfolioId);
}
