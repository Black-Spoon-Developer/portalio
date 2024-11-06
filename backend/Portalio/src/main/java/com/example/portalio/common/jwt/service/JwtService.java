package com.example.portalio.common.jwt.service;

import com.example.portalio.common.jwt.entity.RefreshEntity;
import com.example.portalio.common.jwt.repository.RefreshRepository;
import com.example.portalio.common.jwt.util.JwtUtil;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.repository.MemberRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final JwtUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    private final MemberRepository memberRepository;

    public JwtService(JwtUtil jwtUtil, RefreshRepository refreshRepository, MemberRepository memberRepository) {
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
        this.memberRepository = memberRepository;
    }

    public ResponseEntity<?> issue(HttpServletRequest request, HttpServletResponse response) {
        // 리프레시 토큰 얻기
        String refresh = null;
        Cookie[] cookies = request.getCookies();

        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refresh")) {
                refresh = cookie.getValue();
            }
        }

        // 만약 리프레시 토큰이 없다면
        if (refresh == null) {

            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        // 만료기간 체크
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {

            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        // 토큰이 리프레시 토큰인지 확인
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {

            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        // DB에 refresh 토큰이 저장되어 있는지 확인
        Boolean isExist = refreshRepository.existsByValue(refresh);

        if (!isExist) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        String username = jwtUtil.getUsername(refresh);
        String role = jwtUtil.getRole(refresh);

        // 새로운 토큰 만들기
        String newAccess = jwtUtil.createJwt("access", username, role, 600000L);
        String newResfresh = jwtUtil.createJwt("refresh", username, role, 86400000L);

        // Refresh 토큰 저장 DB에 기존의 Refresh 토큰 삭제 후 Refresh 토큰 저장
        refreshRepository.deleteByValue(refresh);
        addRefreshEntity(username, newResfresh, 86400000L);

        // 쿠키로 refresh 토큰 전달
        response.addCookie(createCookie("refresh", newResfresh));
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("access", newAccess);

        return new ResponseEntity<>(responseBody, HttpStatus.OK);

    }

    // 쿠키 생성 메소드
    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24 * 60 * 60);
        //cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }

    private void addRefreshEntity(String username, String refresh, Long expiredMs) {

        // username으로 회원정보 조회
        Member member = memberRepository.findByMemberUsername(username);

        LocalDateTime issuedAt = LocalDateTime.now();
        LocalDateTime expiresAt = issuedAt.plusNanos(expiredMs * 1_000_000);

        RefreshEntity refreshEntity = RefreshEntity.of(refresh, issuedAt, expiresAt, member);

        // RefreshEntity 저장
        refreshRepository.save(refreshEntity);

        // Member 저장하여 연관 관계 반영
        memberRepository.save(member);
    }

}
