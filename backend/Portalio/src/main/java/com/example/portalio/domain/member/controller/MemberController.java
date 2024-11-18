package com.example.portalio.domain.member.controller;

import com.example.portalio.common.jwt.util.JwtUtil;
import com.example.portalio.domain.member.dto.MemberDTO;
import com.example.portalio.domain.member.dto.MemberPictureDTO;
import com.example.portalio.domain.member.dto.UpdateMemberPictureDTO;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class MemberController {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    // 회원 정보 입력 후 인증
    @Operation(summary = "[회원]회원 인증 처리", description = "accessToken으로 인증 처리")
    @PostMapping("/auth")
    public ResponseEntity<?> authMember(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            // Bearer 제거
            String accessToken = authorizationHeader.replace("Bearer ", "");

            // access 토큰에서 memberId 추출
            Long memberId = jwtUtil.getMemberId(accessToken);

            MemberDTO memberDTO = memberService.authMember(memberId);

            if (memberDTO != null) {
                // 인증 성공 시 회원 정보를 응답
                return ResponseEntity.ok(memberDTO);
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
            MemberDTO member = memberService.jobInfoSave(memberId, jobsubcategoryId);
            return ResponseEntity.ok(member);
        } catch (Exception e) {
            // 예상치 못한 예외가 발생한 경우
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("직무 정보 처리 중 에러가 발생했습니다.");
        }
    }

    // 프로필 사진 업데이트 엔드포인트
    @Operation(summary = "[회원] 프로필 사진 업데이트", description = "회원의 프로필 사진을 업데이트합니다.")
    @PostMapping("/{memberId}/picture")
    public ResponseEntity<?> updateMemberPicture(
            @PathVariable("memberId") Long memberId,
            @RequestBody UpdateMemberPictureDTO updateMemberPictureDTO) {
        memberService.updateMemberPicture(memberId, updateMemberPictureDTO);
        return ResponseEntity.ok("프로필 사진이 성공적으로 업데이트되었습니다.");
    }

    // 프로필 사진 반환 엔드포인트
    @Operation(summary = "[회원] 프로필 사진 반환", description = "회원의 사진 URL을 반환합니다.")
    @GetMapping("/{username}/picture")
    public ResponseEntity<?> getMemberPicture(@PathVariable("username") String username) {
        try {
            // 서비스 호출
            MemberPictureDTO memberPictureDTO = memberService.getMemberPicture(username);
            return ResponseEntity.ok(memberPictureDTO);
        } catch (MemberNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원을 찾을 수 없습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("프로필 사진을 조회하는 중 에러가 발생했습니다.");
        }
    }
}
