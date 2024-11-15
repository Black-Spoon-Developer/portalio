package com.example.portalio.domain.member.entity;

import com.example.portalio.common.jwt.entity.RefreshEntity;
import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.boardcomment.entity.BoardComment;
import com.example.portalio.domain.boardrecom.entity.BoardRecom;
import com.example.portalio.domain.chatbot.entity.Chatbot;
import com.example.portalio.domain.common.entity.AuditableCreatedEntity;
import com.example.portalio.domain.jobhistory.entity.JobHistory;
import com.example.portalio.domain.jobsubcategory.entity.JobSubCategory;
import com.example.portalio.domain.member.enums.Role;
import com.example.portalio.domain.message.entity.Message;
import com.example.portalio.domain.portfolio.entity.Portfolio;
import com.example.portalio.domain.portfoliocomment.entity.PortfolioComment;
import com.example.portalio.domain.portfoliorecom.entity.PortfolioRecom;
import com.example.portalio.domain.repository.entity.Repository;
import com.example.portalio.domain.subscribe.entity.Subscribe;
import com.example.portalio.domain.userdetail.entity.UserDetail;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "member")
public class Member extends AuditableCreatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "member_name", nullable = false, length = 20)
    private String memberName;

    @Column(name = "member_username", nullable = false)
    private String memberUsername;

    @Column(name = "member_picture", nullable = false)
    private String memberPicture;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "member_role", nullable = false)
    private Role memberRole;

    @Column(name = "member_auth", nullable = false)
    private boolean memberAuth = false;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "refresh_token_id")
    private RefreshEntity refreshToken;

    @OneToOne(mappedBy = "member", fetch = FetchType.LAZY)
    private UserDetail userDetail;

    @OneToMany(mappedBy = "follower", fetch = FetchType.LAZY)
    private List<Subscribe> followers = new ArrayList<>();

    @OneToMany(mappedBy = "following", fetch = FetchType.LAZY)
    private List<Subscribe> followings = new ArrayList<>();

    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
    private List<Message> senders = new ArrayList<>();

    @OneToMany(mappedBy = "receiver", fetch = FetchType.LAZY)
    private List<Message> receivers = new ArrayList<>();

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<Chatbot> chatbots = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "member_job",
            joinColumns = @JoinColumn(name = "member_id", referencedColumnName = "member_id"),
            inverseJoinColumns = @JoinColumn(name = "job_id", referencedColumnName = "job_id"))
    private List<JobSubCategory> jobSubCategories = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<Board> boards = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<BoardComment> boardComments = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<BoardRecom> boardRecoms = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<Portfolio> portfolios = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<PortfolioComment> portfolioComments = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<PortfolioRecom> portfolioRecoms = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<Repository> repositories = new ArrayList<>();

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<JobHistory> jobHistories = new ArrayList<>();

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public void setMemberUsername(String memberUsername) {
        this.memberUsername = memberUsername;
    }

    public void setMemberPicture(String memberPicture) {
        this.memberPicture = memberPicture;
    }

    public void setMemberRole(Role memberRole) {
        this.memberRole = memberRole;
    }

    public void setRefreshEntity(RefreshEntity refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void setMemberAuth() {
        this.memberAuth = true;
    }

    public void addJobSubCategory(JobSubCategory jobSubCategory) {
        jobSubCategories.add(jobSubCategory);
    }

    public void removeJobSubCategory(JobSubCategory jobSubCategory) {
        jobSubCategories.remove(jobSubCategory);
    }


    private Member(String name, String username, String picture, Role role) {
        this.memberName = name;
        this.memberUsername = username;
        this.memberPicture = picture;
        this.memberRole = role;
    }

    public static Member of(String name, String username, String picture, Role role) {
        return new Member(name, username, picture, role);
    }


}
