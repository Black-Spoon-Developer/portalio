package com.example.portalio.common.jwt.util;

import com.example.portalio.common.jwt.properties.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtUtil {

    private final JwtProperties jwtProperties;
    private final RefreshTokenService tokenService;
    private SecretKey secretKey;

    // secretKey를 초기화한다.
    @PostConstruct
    protected void init() {
        // 비밀키를 Base64로 디코딩하고 SecretKey 객체로 변환
        byte[] keyBytes = Base64.getDecoder().decode(jwtProperties.getSecret());
        secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    // 최초 로그인시 AccessToken과 RefreshToken을 생성
    public GeneratedToken generatedToken(String email, String role) {

        // refreshToken과 accessToken을 생성한다.
        String refreshToken = generateRefreshToken(email, role);
        String accessToken = generateAccessToken(email, role);

        // 토큰을 Redis에 저장한다.
        tokenService.saveTokenInfo(email, role, accessToken);
        return new GeneratedToken(accessToken, refreshToken);
    }
    
    // 리프레시 토큰 생성
    public String generateRefreshToken(String email, String role) {
        // 토큰의 유효 기간을 밀리초 단위로 설정.
        long refreshPeriod = 1000L * 60L * 60L * 24L * 14; // 2주

        // 현재 시간과 날짜
        Date now = new Date();

        // 새로운 클레임 객체 및 이메일과 역할(권한)을 셋팅
        return Jwts.builder()
                .subject(email)
                // 클레임 설정
                .claim("role", role)
                // 발행일자를 넣는다.
                .issuedAt(now)
                // 토큰의 만료일시를 설정한다.
                .expiration(new Date(now.getTime() + refreshPeriod))
                // 지정된 서명 알고리즘과 비밀 키를 사용하여 토큰을 서명한다.
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }
    
    // 액세스 토큰 생성
    public String generateAccessToken(String email, String role) {
        long tokenPeriod = 1000L * 60L * 60L; // 1시간

        Date now = new Date();
        return Jwts.builder()
                .claim("role", role)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + tokenPeriod))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }
    
    // 토큰 검증
    public boolean verifyToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parser()
                    .verifyWith(secretKey) // 비밀키를 설정하여 파싱한다.
                    .build().parseSignedClaims(token); // 주어진 토큰을 파싱하여 Claims 객체를 얻는다.
            // 토큰의 만료 시간과 현재 시간비교
            return claims.getPayload()
                    .getExpiration()
                    .after(new Date()); // 만료 시간이 현재 시간 이후인지 확인하여 유효성 검사 결과를 반환
        } catch (Exception e) {
            return false;
        }
    }

    // 토큰에서 Email을 추출
    public String getUid(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getSubject();
    }

    // 토큰에서 ROLE(권한)만 추출한다.
    public String getRole(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }

}
