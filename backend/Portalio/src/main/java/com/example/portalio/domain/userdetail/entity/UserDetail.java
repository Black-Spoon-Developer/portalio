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
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_email", nullable = false, length = 40, unique = true)
    private String userEmail;

    //    @Column(name = "user_major", nullable = false, length = 20)
    // nullable로 해야 추후에 usermajor를 받을 수 있음 - 진송이형하고 상의하기
    @Column(name = "user_major", length = 20)
    private String userMajor;

    @Column(name = "user_ticket")
    private Integer userTicket = 0;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private Member member;

    public void setMember(Member member) {
        this.member = member;
    }

    public void setUserEmail(String email) {
        this.userEmail = email;
    }

    public void setUserTicket(Integer ticket) { this.userTicket = ticket; }


    public static UserDetail of(String userEmail, Member member) {
        System.out.println(member.getMemberId());
        UserDetail userDetail = new UserDetail();
        userDetail.userEmail = userEmail;
//        userDetail.userId = member.getMemberId();
        userDetail.member = member;
        return userDetail;
    }


}
