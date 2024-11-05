package com.example.portalio.domain.member.controller;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

        String username = customOAuth2User.getUsername();

        Member member = memberService.memberTokenGet(username);

        if (member != null) {
            return ResponseEntity.ok(member);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원을 찾을 수 없습니다.");
        }
    }

//    // 멤버 정보 조회
//    @Operation(summary = "[회원]회원 정보 조회", description = "email 값으로 조회하기")
//    @GetMapping("/{email}")
//    public ResponseEntity<?> memberGet(@PathVariable("email") String email) {
//        Member member = memberService.memberEmailGet(email);
//
//        if (member != null) {
//            return ResponseEntity.ok(member);
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원을 찾을 수 없습니다.");
//        }
//    }
//
//    // 멤버 정보 수정
//    @Operation(summary = "[회원]회원 정보 수정", description = "email 값으로 조회, RequestBody 값으로 수정할 정보 보내기")
//    @PutMapping("/{email}")
//    public ResponseEntity<?> memberUpdate(@PathVariable("email") String email,
//                                          @RequestBody @Valid MemberRequestDTO request) {
//        try {
//            Member member = memberService.memberUpdate(email, request);
//            return ResponseEntity.ok(member);
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//        }
//
//
//    }
    // 멤버 정보 삭제

    // 닉네임 중복 검사
    @Operation(summary = "[회원]회원 닉네임 중복 확인", description = "사용자가 입력한 닉네임을 바탕으로 검사")
    @GetMapping("/duplicate/nickname/{nickname}")
    public ResponseEntity<?> nicknameDupliCheck(@PathVariable("nickname") String nickname) {
        if (nickname == null || nickname.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("닉네임을 입력해 주세요.");
        }

        try {
            boolean isDuplicate = memberService.nicknameDupliCheck(nickname);
            return ResponseEntity.ok(isDuplicate);
        } catch (Exception e) {
            // 예상치 못한 예외가 발생한 경우
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("닉네임 중복 검사 중 오류가 발생했습니다.");
        }
    }

//    // 닉네임 설정 및 수정
//    @Operation(summary = "[회원]회원 닉네임 설정 및 수정", description = "이메일로 사용자의 정보를 조회하고 사용자가 입력한 닉네임을 바탕으로 설정 및 수정")
//    @PutMapping("/{email}/nickname/{nickname}")
//    public ResponseEntity<?> memberNicknameSave(@PathVariable("email") String email,
//                                                @PathVariable("nickname") String nickname) {
//        Member member = memberService.memberNicknameSave(email, nickname);
//
//        return ResponseEntity.ok(member);
//    }


}
