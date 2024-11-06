package com.example.portalio.common.jwt.filter;

import com.example.portalio.common.jwt.repository.RefreshRepository;
import com.example.portalio.common.jwt.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.web.filter.GenericFilterBean;

public class CustomLogoutFilter extends GenericFilterBean {

    private final JwtUtil jwtUtil;
    private final RefreshRepository refreshRepository;

    public CustomLogoutFilter(JwtUtil jwtUtil, RefreshRepository refreshRepository) {
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {

        doFilter((HttpServletRequest) request, (HttpServletResponse) response, filterChain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {

        String requestUri = request.getRequestURI();
        if (!requestUri.matches("^/api/v1/users/logout$")) {

            filterChain.doFilter(request, response);
            return;
        }

        String requestMethod = request.getMethod();
        if (!requestMethod.equals("POST")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 리프레시 토큰 얻기
        String refresh = null;
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {

                if (cookie.getName().equals("refresh")) {
                    refresh = cookie.getValue();
                    break;
                }
            }
        }

        // 리프레시 토큰 여부
        if (refresh == null) {

            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // 토큰이 refresh인지 확인
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // DB에 저장되어 있는지 확인
        Boolean isExist = refreshRepository.existsByValue(refresh);
        if (!isExist) {

            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // 로그아웃 진행
        // Refresh 토큰 DB에서 제거
        refreshRepository.deleteByValue(refresh);

        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");

        response.addCookie(cookie);
        response.setStatus(HttpServletResponse.SC_OK);

    }

}
