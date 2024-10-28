package com.example.portalio.domain.portfolio.entity;

import com.example.portalio.domain.common.entity.AuditableCreatedEntity;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.portfoliocomment.entity.PortfolioComment;
import com.example.portalio.domain.portfoliorecom.entity.PortfolioRecom;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "portfolio")
public class Portfolio extends AuditableCreatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "portfolio_id")
    private Long portfolioId;

    @Column(name = "portfolio_title", nullable = false, length = 50)
    private String portfolioTitle;

    @Column(name = "portfolio_content", nullable = false, columnDefinition = "TEXT")
    private String portfolioContent;

    @Column(name = "portfolio_job", nullable = false, length = 50)
    private String portfolioJob;

    @Column(name = "portfolio_img_key", nullable = false, columnDefinition = "TEXT")
    private String portfolioImgKey;

    @Column(name = "portfolio_file_key", nullable = false, columnDefinition = "TEXT")
    private String portfolioFileKey;

    @Column(name = "portfolio_views", nullable = false)
    private Integer portfolioViews;

    @Column(name = "portfolio_thumbnail_img", nullable = false, columnDefinition = "TEXT")
    private String portfolioThumbnailImg;

    @Column(name = "portfolio_recommendation_count", nullable = false)
    private Integer portfolioRecommendationCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "portfolio")
    private List<PortfolioComment> portfolioComments = new ArrayList<>();

    @OneToMany(mappedBy = "portfolio")
    private List<PortfolioRecom> portfolioRecoms = new ArrayList<>();
}
