package com.example.portalio.common.oauth.handler;

import com.example.portalio.common.jwt.entity.RefreshEntity;
import com.example.portalio.common.jwt.repository.RefreshRepository;
import com.example.portalio.common.jwt.util.JwtUtil;
import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.enums.Role;
import com.example.portalio.domain.member.error.MemberNotFoundException;
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
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.services.s3.endpoints.internal.Value.Str;

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
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        // OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();
        String username = customUserDetails.getUsername();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        Member member = memberRepository.findByMemberUsername(username);

        // 회원 인증 여부
        boolean isAuth = false;

        if (member == null) {
            System.out.println("회원정보가 없습니다.");
        } else {
            // 로그인 중에 만약 발급된 refresh 토큰이 있다면 DB에서 찾아서 검증 후 토큰이 만료 되었으면 새로운 토큰 발급하고 아니면
            // 토큰 값을 조회해서 그대로 쿠키에 담아서 그냥 보내주기
            RefreshEntity refreshToken = member.getRefreshToken();

            // 회원인증 정보 체크
            isAuth = member.isMemberAuth();

            if (refreshToken != null) {
                String refreshTokenValue = refreshToken.getValue();
                boolean isExired = jwtUtil.isExpired(refreshTokenValue);

                // 유효기간이 만료되지 않았으면
                if (!isExired) {
                    // 응답 설정
                    response.addCookie(createCookie("refresh", refreshTokenValue));
                    response.setStatus(HttpStatus.OK.value());

                } else {
                    // 유저 정보 추출
                    Long memberId = member.getMemberId();
                    String memberName = member.getMemberName();
                    String memberUsername = member.getMemberUsername();
                    String memberPicture = member.getMemberPicture();

                    // 토큰 생성
                    String refresh = jwtUtil.createJwt(memberId, memberName, memberUsername, memberPicture, "refresh", role, 86400000L);

                    // Refresh 토큰 저장
                    addRefreshEntity(username, refresh, 86400000L);

                    // 응답 설정
                    response.addCookie(createCookie("refresh", refresh));
                    response.setStatus(HttpStatus.OK.value());
                }


            } else {
                // 유저 정보 추출
                Long memberId = member.getMemberId();
                String memberName = member.getMemberName();
                String memberUsername = member.getMemberUsername();
                String memberPicture = member.getMemberPicture();

                // 토큰 생성
                String refresh = jwtUtil.createJwt(memberId, memberName, memberUsername, memberPicture, "refresh", role, 86400000L);

                // Refresh 토큰 저장
                addRefreshEntity(username, refresh, 86400000L);

                // 응답 설정
                response.addCookie(createCookie("refresh", refresh));
                response.setStatus(HttpStatus.OK.value());
            }

            // 새 유저라면 정보 입력 페이지로 리다이렉트
            if (!isAuth) {
                response.sendRedirect("http://localhost:5173/user/signup");
            } else {
                response.sendRedirect("http://localhost:5173/");
            }
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
        Member member = memberRepository.findByMemberUsername(username)
                .orElseThrow(MemberNotFoundException::new);

        LocalDateTime issuedAt = LocalDateTime.now();
        LocalDateTime expiresAt = issuedAt.plusNanos(expiredMs * 1_000_000);

        RefreshEntity refreshEntity = RefreshEntity.of(refresh, issuedAt, expiresAt, member);

        // RefreshEntity 저장
        refreshRepository.save(refreshEntity);

        // Member 저장하여 연관 관계 반영
        memberRepository.save(member);
    }

}
