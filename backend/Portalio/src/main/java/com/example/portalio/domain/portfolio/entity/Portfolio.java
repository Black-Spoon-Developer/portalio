package com.example.portalio.domain.portfolio.entity;

import com.example.portalio.domain.common.entity.AuditableCreatedEntity;
import com.example.portalio.domain.jobsubcategory.entity.JobSubCategory;
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
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "portfolio")
public class Portfolio extends AuditableCreatedEntity {

    private static final String DEFAULT_IMAGE_URL = "https://avatars.githubusercontent.com/u/157494028?v=4";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "portfolio_id")
    private Long portfolioId;

    @Column(name = "portfolio_title", nullable = false, length = 50)
    private String portfolioTitle;

    @Column(name = "portfolio_description", nullable = false, columnDefinition = "TEXT")
    private String portfolioDescription;

    @Column(name = "portfolio_content", nullable = false, columnDefinition = "TEXT")
    private String portfolioContent;

    @Column(name = "portfolio_views", nullable = false)
    private Integer portfolioViews = 0;

    @Column(name = "portfolio_thumbnail_img", nullable = false, columnDefinition = "TEXT")
    private String portfolioThumbnailImg = DEFAULT_IMAGE_URL;

    @Column(name = "portfolio_recommendation_count", nullable = false)
    private Integer portfolioRecommendationCount = 0;

    @Column(name = "portfolio_post", nullable = false)
    private Boolean portfolioPost = false;

    @Column(name = "portfolio_is_primary", nullable = false)
    private Boolean portfolioIsPrimary = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    private JobSubCategory jobSubCategory;

    @OneToMany(mappedBy = "portfolio")
    private List<PortfolioComment> portfolioComments = new ArrayList<>();

    @OneToMany(mappedBy = "portfolio")
    private List<PortfolioRecom> portfolioRecoms = new ArrayList<>();

    private Portfolio(String portfolioTitle, String portfolioDescription, String portfolioContent, String portfolioThumbnailImg, Boolean portfolioPost , JobSubCategory jobSubCategory, Member member) {
        this.portfolioTitle = portfolioTitle;
        this.portfolioDescription = portfolioDescription;
        this.portfolioContent = portfolioContent;
        this.portfolioThumbnailImg = portfolioThumbnailImg;
        this.portfolioPost = portfolioPost;
        this.jobSubCategory = jobSubCategory;
        this.member = member;
    }

    public static Portfolio of(String portfolioTitle, String portfolioDescription, String portfolioContent, String portfolioThumbnailImg, Boolean portfolioPost, JobSubCategory jobSubCategory, Member member) {
        return new Portfolio(portfolioTitle, portfolioDescription, portfolioContent, portfolioThumbnailImg, portfolioPost, jobSubCategory, member);
    }

    public void setPortfolioTitle(String portfolioTitle) { this.portfolioTitle = portfolioTitle; }

    public void setPortfolioContent(String portfolioContent) { this.portfolioContent = portfolioContent; }

    public void setPortfolioThumbnailImg(String portfolioThumbnailImg) { this.portfolioThumbnailImg = portfolioThumbnailImg; }

    public void setPortfolioPost(Boolean portfolioPost) { this.portfolioPost = portfolioPost; }

    public void setJobSubCategory(JobSubCategory jobSubCategory) { this.jobSubCategory = jobSubCategory; }

    public void setMember(Member member) { this.member = member; }

    public void setPortfolioRecommendationCount(Integer portfolioRecommendationCount) { this.portfolioRecommendationCount = portfolioRecommendationCount; }

    public void setPortfolioIsPrimary(Boolean portfolioIsPrimary) { this.portfolioIsPrimary = portfolioIsPrimary; }

    public void setPortfolioDescription(String portfolioDescription) { this.portfolioDescription = portfolioDescription; }

    public void setPortfolioViews(Integer portfolioViews) { this.portfolioViews = portfolioViews; }
}
