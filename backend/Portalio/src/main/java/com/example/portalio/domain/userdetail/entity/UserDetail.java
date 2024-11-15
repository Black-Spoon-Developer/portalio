package com.example.portalio.domain.userdetail.entity;

import com.example.portalio.domain.member.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
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
    @Column(name = "member_id")
    private Long memberId;

    // 추후 unique true로 다시 바꾼후 프론트에서 조회를 해서 요청을 안보내도록 하기
    @Column(name = "user_nickname")
    private String userNickname;

    @Column(name = "user_email", length = 40)
    private String userEmail;

    @Column(name = "user_ticket")
    private Integer userTicket = 0;

    @Column(name = "user_facebook")
    private String userFacebook;

    @Column(name = "user_instagram")
    private String userInstagram;

    @Column(name = "user_linkedin")
    private String userLinkedin;

    @Column(name = "user_github")
    private String userGithub;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "member_id", insertable = false, updatable = false)
    private Member member;

    public void setUserNickname(String userNickname) { this.userNickname = userNickname; }

    public void setMember(Member member) {
        this.member = member;
    }

    public void setUserEmail(String email) {
        this.userEmail = email;
    }

    public void setUserTicket(Integer ticket) { this.userTicket = ticket; }

    public void setUserFacebook(String facebook) {this.userFacebook = facebook;}

    public void setUserInstagram(String instagram) {this.userInstagram = instagram;}

    public void setUserLinkedin(String linkedin) {this.userLinkedin = linkedin;}

    public void setUserGithub(String github) {this.userGithub = github;}

    public static UserDetail of(String userEmail, String userNickname, Member member) {
        UserDetail userDetail = new UserDetail();
        userDetail.userEmail = userEmail;
        userDetail.userNickname = userNickname;
        userDetail.member = member;
        return userDetail;
    }


}
