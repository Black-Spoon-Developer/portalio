package com.example.portalio.common.jwt.service;

import com.example.portalio.common.jwt.entity.RefreshEntity;
import com.example.portalio.common.jwt.repository.RefreshRepository;
import com.example.portalio.common.jwt.util.JwtUtil;
import com.example.portalio.common.oauth.dto.UserResponseDTO;
import com.example.portalio.domain.jobsubcategory.entity.JobSubCategory;
import com.example.portalio.domain.jobsubcategory.repository.JobSubCategoryRepository;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.member.repository.MemberRepository;
import com.example.portalio.domain.userdetail.entity.UserDetail;
import com.example.portalio.domain.userdetail.error.NoUserDetailException;
import com.example.portalio.domain.userdetail.repository.UserDetailRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final JwtUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    private final MemberRepository memberRepository;
    private final UserDetailRepository userDetailRepository;

    public JwtService(JwtUtil jwtUtil, RefreshRepository refreshRepository, MemberRepository memberRepository, UserDetailRepository userDetailRepository, JobSubCategoryRepository jobSubCategoryRepository) {
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
        this.memberRepository = memberRepository;
        this.userDetailRepository = userDetailRepository;
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

        // 토큰이 리프레시 토큰인지 확인
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {

            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        // 만료기간 체크
        boolean isRefreshExpired = jwtUtil.isExpired(refresh);

        // DB에 refresh 토큰이 저장되어 있는지 확인
        Boolean isExist = refreshRepository.existsByValue(refresh);

        if (!isExist) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        // 토큰에서 정보 추출
        Long memberId = jwtUtil.getMemberId(refresh);
        String name = jwtUtil.getName(refresh);
        String username = jwtUtil.getUsername(refresh);
        String picture = jwtUtil.getPicture(refresh);
        String email = jwtUtil.getEmail(refresh);
        String role = jwtUtil.getRole(refresh);
        
        // 리프레시 토큰이 만료된 경우 새로운 리프레시 토큰도 생성
        if (isRefreshExpired) {
            String newRefresh = jwtUtil.createJwt(memberId, name, username, picture, "refresh", email, role, 2592000000L);

            // 기존 리프레시 토큰 삭제 후 새로 저장
            refreshRepository.deleteByValue(refresh);
            addRefreshEntity(username, newRefresh, 86400000L);

            // 새 리프레시 토큰을 쿠키로 추가
            response.addCookie(createCookie("refresh", newRefresh));
        }

        // access 토큰 발급
        String newAccess = jwtUtil.createJwt(memberId, name, username, picture, "access", email, role, 2592000000L);
        
        // memberId로 그 회원의 userDetail 정보 가져오기
        UserDetail userDetail = userDetailRepository.findByMemberId(memberId)
                .orElseThrow(NoUserDetailException::new);

        String userNickname = userDetail.getUserNickname();
        String userEmail = userDetail.getUserEmail();
        Integer userTickets = userDetail.getUserTicket();

         Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
         boolean memberAuth = member.isMemberAuth();

        List<JobSubCategory> jobSubCategories = member.getJobSubCategories();

        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("access", newAccess);
        responseBody.put("memberId", memberId.toString());
        responseBody.put("name", name);
        responseBody.put("username", username);
        responseBody.put("nickname", userNickname);
        responseBody.put("userEmail", userEmail);
        responseBody.put("picture", picture);
        responseBody.put("tickets", userTickets.toString());
        responseBody.put("role", role);

        if (jobSubCategories.isEmpty()) {
            responseBody.put("jobSubCategoryId", "0");
        } else {
            JobSubCategory jobSubCategory = jobSubCategories.get(0);
            responseBody.put("jobSubCategoryId", jobSubCategory.getJobId().toString());
        }

        if (memberAuth) {
            responseBody.put("auth", "1");
        } else {
            responseBody.put("auth", "0");
        }

        return new ResponseEntity<>(responseBody, HttpStatus.OK);

    }

    // 쿠키 생성 메소드
    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24 * 60 * 60);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }

    private void addRefreshEntity(String username, String refresh, Long expiredMs) {

        // username으로 회원정보 조회
        Member member = memberRepository.findByMemberUsername(username)
                .orElseThrow(MemberNotFoundException::new);

        LocalDateTime issuedAt = LocalDateTime.now();
        LocalDateTime expiresAt = issuedAt.plusNanos(expiredMs * 1_000_000);

        RefreshEntity refreshEntity = RefreshEntity.of(refresh, issuedAt, expiresAt);

        // RefreshEntity 저장
        refreshRepository.save(refreshEntity);

        // Member 저장하여 연관 관계 반영
        member.setRefreshEntity(refreshEntity);
        memberRepository.save(member);
    }

}
