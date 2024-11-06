package com.example.portalio.domain.member.controller;

import com.example.portalio.common.jwt.util.JwtUtil;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class MemberController {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    // 회원 정보 입력 후 인증
    @Operation(summary = "[회원]회원 인증 처리", description = "access 토큰에서 ")
    @PostMapping("/auth")
    public ResponseEntity<?> authMember(@RequestHeader("access") String accessToken) {
        try {
            // access 토큰에서 memberId 추출
            Long memberId = jwtUtil.getMemberId(accessToken);
            Member member = memberService.authMember(memberId);

            if (member != null) {
                // 인증 성공 시 회원 정보를 응답
                return ResponseEntity.ok(member);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원을 찾을 수 없습니다.");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 토큰입니다.");
        }
    }

    // 회원 직무 설정
    @Operation(summary = "[회원] 직무 정보 저장", description = "memberId, JobsubcategoryId 값으로 저장")
    @PostMapping("/job/save/{memberId}/{jobsubcategoryId}")
    public ResponseEntity<?> jobInfoSave(@PathVariable("memberId") Long memberId,
                                         @PathVariable("jobsubcategoryId") Long jobsubcategoryId) {

        try {
            Member member = memberService.jobInfoSave(memberId, jobsubcategoryId);
            return ResponseEntity.ok(member);
        } catch (Exception e) {
            // 예상치 못한 예외가 발생한 경우
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("직무 정보 처리 중 에러가 발생했습니다.");
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
