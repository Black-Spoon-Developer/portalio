package com.example.portalio.domain.portfoliocomment.repository;

import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.portfolio.entity.Portfolio;
import com.example.portalio.domain.portfoliocomment.entity.PortfolioComment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioCommentRepository extends JpaRepository<PortfolioComment, Long> {

    List<PortfolioComment> findAllByPortfolio(Portfolio portfolio);

    Optional<PortfolioComment> findByPortfolioAndMemberAndPortfolioCommentId(Portfolio portfolio, Member member, Long commentId);
}
