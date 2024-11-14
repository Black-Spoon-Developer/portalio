package com.example.portalio.domain.portfoliocomment.entity;

import com.example.portalio.domain.common.entity.AuditableCreatedEntity;
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
@Table(name = "portfolio_comment")
public class PortfolioComment extends AuditableCreatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "portfolio_comment_id")
    private Long portfolioCommentId;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id")
    private Portfolio portfolio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private PortfolioComment(String content) {
        this.content = content;
    }

    public static PortfolioComment from(String content) {
        return new PortfolioComment(content);
    }

    public void addRelation(Portfolio portfolio, Member member) {
        if (this.portfolio != null) {
            this.portfolio.getPortfolioComments().remove(this);
        }
        this.portfolio = portfolio;
        portfolio.getPortfolioComments().add(this);

        if (this.member != null) {
            this.member.getPortfolioComments().remove(this);
        }
        this.member = member;
        member.getPortfolioComments().add(this);
    }

    public void setContent(String content) { this.content = content; }
}
