package com.example.portalio.common.jwt.filter;

import com.example.portalio.common.jwt.util.JwtUtil;
import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.common.oauth.dto.UserDTO;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // Cookie들을 불러온 뒤 Authorization Key에 담긴 쿠키를 찾음
        String authorization = null;

        Cookie[] cookies = request.getCookies();

        for (Cookie cookie : cookies) {

            System.out.println(cookie.getName());
            if (cookie.getName().equals("Authorization")) {
                authorization = cookie.getValue();
            }
        }

        // Authorization 헤더 검증
        if (authorization == null) {
            System.out.println("token null");
            filterChain.doFilter(request, response);

            // 조건이 해당되면 메서드 종료 (필수)
            return;
        }

        // 토큰
        String token = authorization;

        // 토큰 소멸 시간 검증
        if (jwtUtil.isExpired(token)) {
            System.out.println("token expired");
            filterChain.doFilter(request, response);

            // 조건이 해당되면 메소드 종료(필수)
            return;
        }

        // 토큰에서 username과 role 획득
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        // userDTO 생성하여 값 set
        UserDTO userDTO = UserDTO.builder()
                .username(username)
                .role(role)
                .build();

        // UserDetails 회원 정보 객체 담기
        CustomOAuth2User customOAuth2User = new CustomOAuth2User(userDTO);

        // 스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customOAuth2User, null, customOAuth2User.getAuthorities());
        
        // 세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }



}
