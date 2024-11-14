package com.example.portalio.domain.portfoliorecom.entity;

import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.portfolio.entity.Portfolio;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "portfolio_recom")
public class PortfolioRecom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "portfolio_recom_id")
    private Long portfolioRecomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id")
    private Portfolio portfolio;

    private PortfolioRecom(Member member, Portfolio portfolio) {
        this.member = member;
        this.portfolio = portfolio;
    }

    public static PortfolioRecom of(Member member, Portfolio portfolio) {
        return new PortfolioRecom(member, portfolio);
    }
}
