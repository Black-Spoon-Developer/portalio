package com.example.portalio.domain.portfoliorecom.repository;

import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.portfolio.entity.Portfolio;
import com.example.portalio.domain.portfoliorecom.entity.PortfolioRecom;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioRecomRepository extends JpaRepository<PortfolioRecom, Long> {

    Boolean existsByMemberAndPortfolio(Member member, Portfolio portfolio);

    PortfolioRecom findByMemberAndPortfolio(Member member, Portfolio portfolio);

    List<PortfolioRecom> findAllByMemberAndPortfolioIn(Member member, List<Portfolio> portfolios);
}