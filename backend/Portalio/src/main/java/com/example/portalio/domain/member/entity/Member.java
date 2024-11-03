package com.example.portalio.domain.member.entity;

import static com.example.portalio.domain.member.enums.Role.USER;

import com.example.portalio.common.jwt.entity.RefreshEntity;
import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.boardcomment.entity.BoardComment;
import com.example.portalio.domain.boardrecom.entity.BoardRecom;
import com.example.portalio.domain.chatbot.entity.Chatbot;
import com.example.portalio.domain.common.entity.AuditableCreatedEntity;
import com.example.portalio.domain.member.enums.Role;
import com.example.portalio.domain.message.entity.Message;
import com.example.portalio.domain.portfolio.entity.Portfolio;
import com.example.portalio.domain.portfoliocomment.entity.PortfolioComment;
import com.example.portalio.domain.portfoliorecom.entity.PortfolioRecom;
import com.example.portalio.domain.repository.entity.Repository;
import com.example.portalio.domain.subscribe.entity.Subscribe;
import com.example.portalio.domain.userhopejob.entity.UserHopeJob;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "member")
public class Member extends AuditableCreatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "member_email", nullable = false, length = 40)
    private String memberEmail;

    @Column(name = "member_nickname")
    private String memberNickname;

    @Column(name = "member_name", nullable = false, length = 20)
    private String memberName;

    @Column(name = "member_username", nullable = false)
    private String memberUsername;

    @Column(name = "member_picture", nullable = false)
    private String memberPicture;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "member_role", nullable = false)
    private Role memberRole;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "refresh_token_id")
    private RefreshEntity refreshEntity;

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

    @OneToMany(mappedBy = "member")
    private List<UserHopeJob> userHopeJobs = new ArrayList<>();

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
}
