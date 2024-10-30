package com.example.portalio.domain.userdetail.entity;

import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.oauthtoken.entity.OauthToken;
import com.example.portalio.domain.refreshtoken.entity.RefreshToken;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "user_detail")
public class UserDetail {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_email", nullable = false, length = 40)
    private String userEmail;

    @Column(name = "user_major", nullable = false, length = 20)
    private String userMajor;

    @Column(name = "user_ticket")
    private Integer userTicket = 0;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private Member member;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "oauth_token_id")
    private OauthToken oauthToken;
}
