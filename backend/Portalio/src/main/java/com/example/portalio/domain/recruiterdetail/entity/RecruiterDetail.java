package com.example.portalio.domain.recruiterdetail.entity;

import com.example.portalio.domain.member.entity.Member;
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
@Table(name = "recruiter_detail")
public class RecruiterDetail {

    @Id
    @Column(name = "member_id")
    private Long userId;

    @Column(name = "password", nullable = false, length = 20)
    private String password;

    @Column(name = "company_name", nullable = false, length = 40)
    private String companyName;

    @Column(name = "recruiter_name", nullable = false, length = 20)
    private String recruiterName;

    @Column(name = "recruiter_phone_number", nullable = false, length = 20)
    private String recruiterPhoneNumber;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", insertable = false, updatable = false)
    private Member member;

}
