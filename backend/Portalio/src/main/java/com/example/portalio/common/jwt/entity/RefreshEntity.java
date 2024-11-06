package com.example.portalio.common.jwt.entity;

import com.example.portalio.domain.member.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "refresh_token")
public class RefreshEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long refreshId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String value;

    @Column(nullable = false)
    private LocalDateTime issuedAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private Boolean revoked = false;

    @OneToOne(mappedBy = "refreshToken", fetch = FetchType.LAZY)
    private Member member;

    public static RefreshEntity of(String tokenValue, LocalDateTime issuedAt, LocalDateTime expiresAt, Member member) {
        RefreshEntity refreshEntity = new RefreshEntity();
        refreshEntity.value = tokenValue;
        refreshEntity.issuedAt = issuedAt;
        refreshEntity.expiresAt = expiresAt;
        refreshEntity.revoked = false;
        refreshEntity.addRelation(member);

        return refreshEntity;
    }

    // 연관관계 설정 메서드
    public void addRelation(Member member) {
        if (this.member != null) {
            this.member.setRefreshEntity(null);
        }
        this.member = member;
        member.setRefreshEntity(this);
    }

}
