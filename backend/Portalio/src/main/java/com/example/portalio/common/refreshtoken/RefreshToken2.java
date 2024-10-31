//package com.example.portalio.common.refreshtoken;
//
//import com.example.portalio.domain.member.entity.Member;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import org.springframework.data.redis.core.RedisHash;
//
//import java.io.Serializable;
//import java.time.LocalDateTime;
//
//
//@Getter
//@AllArgsConstructor
//@RedisHash(value = "jwtToken", timeToLive = 60 * 60 * 24 * 14)
//public class RefreshToken2 implements Serializable {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Long refreshId;
//
//    @Column(nullable = false, columnDefinition = "TEXT")
//    private String value;
//
//    @Column(nullable = false)
//    private LocalDateTime issuedAt;
//
//    @Column(nullable = false)
//    private LocalDateTime expiresAt;
//
//    @Column(nullable = false)
//    private Boolean revoked = false;
//
//    @OneToOne(mappedBy = "refreshToken", fetch = FetchType.LAZY)
//    private Member member;
//}
