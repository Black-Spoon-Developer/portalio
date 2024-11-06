package com.example.portalio.common.oauth.handler;

import com.example.portalio.common.jwt.entity.RefreshEntity;
import com.example.portalio.common.jwt.repository.RefreshRepository;
import com.example.portalio.common.jwt.util.JwtUtil;
import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.enums.Role;
import com.example.portalio.domain.member.repository.MemberRepository;
import com.example.portalio.domain.userdetail.entity.UserDetail;
import com.example.portalio.domain.userdetail.repository.UserDetailRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Iterator;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    private final MemberRepository memberRepository;


    public CustomSuccessHandler(JwtUtil jwtUtil, RefreshRepository refreshRepository,
                                MemberRepository memberRepository) {
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
        this.memberRepository = memberRepository;

    }

    // 인증 성공 시
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        // OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String username = customUserDetails.getUsername();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        // 토큰 생성
        String refresh = jwtUtil.createJwt("refresh", username, role, 86400000L);

        // Refresh 토큰 저장
        addRefreshEntity(username, refresh, 86400000L);

        // 응답 설정
        response.addCookie(createCookie("refresh", refresh));
        response.setStatus(HttpStatus.OK.value());

        // 새 유저라면 정보 입력 페이지로 리다이렉트
        if (customUserDetails.isNewUser()) {
            response.sendRedirect("http://localhost:5173/user/signup");
        } else {
            response.sendRedirect("http://localhost:5173/");
        }

    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(60 * 60 * 60);
//        cookie.setSecure(true); // https 설정시 작성해줘야함
        cookie.setPath("/"); // 쿠키가 보일 위치 전역으로 설정
        cookie.setHttpOnly(true); // 자바스크립트가 쿠키를 가져가지 못하도록 설정

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
