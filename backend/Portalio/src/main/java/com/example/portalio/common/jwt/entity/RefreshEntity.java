package com.example.portalio.common.jwt.entity;

import com.example.portalio.domain.member.dto.MemberDTO;
import com.example.portalio.domain.member.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    @Column(name = "refresh_token_id")
    private Long refreshTokenId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String value;

    @Column(nullable = false)
    private LocalDateTime issuedAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private Boolean revoked = false;

    public static RefreshEntity of(String tokenValue, LocalDateTime issuedAt, LocalDateTime expiresAt) {
        RefreshEntity refreshEntity = new RefreshEntity();
        refreshEntity.value = tokenValue;
        refreshEntity.issuedAt = issuedAt;
        refreshEntity.expiresAt = expiresAt;
        refreshEntity.revoked = false;

        return refreshEntity;
    }

}
