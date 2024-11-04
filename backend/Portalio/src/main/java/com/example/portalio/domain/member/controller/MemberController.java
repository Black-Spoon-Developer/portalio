package com.example.portalio.domain.member.controller;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.member.dto.MemberRequestDTO;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class MemberController {

    private final MemberService memberService;

    // 토큰으로 멤버 정보 조회
    @Operation(summary = "[회원] 회원 정보 조회", description = "access 토큰을 사용하여 현재 로그인된 회원 정보 조회")
    @GetMapping("/info")
    public ResponseEntity<?> memberGet(Authentication authentication) {
        // Authentication에서 email 정보 가져오기
        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();
//        System.out.println(authentication);
//        System.out.println(customOAuth2User.getEmail());
        Member member = memberService.memberGet(customOAuth2User.getEmail());
//        System.out.println(member);

        if (member != null) {
            return ResponseEntity.ok(member);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Member not found");
        }
    }

    // 멤버 정보 조회
    @Operation(summary = "[회원]회원 정보 조회", description = "email 값으로 조회하기")
    @GetMapping("/{email}")
    public ResponseEntity<?> memberGet(@PathVariable("email") String email) {
        Member member = memberService.memberGet(email);

        if (member != null) {
            return ResponseEntity.ok(member);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Member not found");
        }
    }

    // 멤버 정보 수정
    @Operation(summary = "[회원]회원 정보 수정", description = "email 값으로 조회, RequestBody 값으로 수정할 정보 보내기")
    @PatchMapping("/{email}")
    public ResponseEntity<?> memberUpdate(@PathVariable("email") String email,
                                          @RequestBody @Valid MemberRequestDTO request) {
        try {
            Member member = memberService.memberUpdate(email, request);
            return ResponseEntity.ok(member);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }


    }
    // 멤버 정보 삭제
}
