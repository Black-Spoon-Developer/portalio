package com.example.portalio.domain.userdetail.controller;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.jobhistory.dto.JobHistoryResponse;
import com.example.portalio.domain.userdetail.dto.*;
import com.example.portalio.domain.userdetail.entity.UserDetail;
import com.example.portalio.domain.userdetail.service.UserDetailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
public class UserDetailController {

    private final UserDetailService userDetailService;

    @Operation(summary = "티켓 랭킹", description = "티켓 랭킹임")
    @GetMapping("/ticket/ranking")
    public ResponseEntity<List<TicketRankingResponse>> getTicketRanking(@RequestParam int page,
                                                                        @RequestParam int size) {
        List<TicketRankingResponse> ranking = userDetailService.getTicketRanking(page, size);
        return ResponseEntity.ok(ranking);
    }

    @Operation(summary = "티켓 추가", description = "활동으로 티켓 추가")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/ticket/update")
    public ResponseEntity<TicketResponse> updateTicket(
            @RequestParam Integer ticketCount,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        TicketResponse response = userDetailService.updateTicket(ticketCount, oauth2User);

        return ResponseEntity.ok(response);
    }

    // userDetail 정보 저장 - 닉네임
    @Operation(summary = "[개인회원] 회원 닉네임 설정", description = "닉네임, memberId의 값을 보내주어 닉네임 설정")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/nickname")
    public ResponseEntity<?> saveUserDetail(@RequestBody UserDetailRequest request) {
        UserDetailDTO savedUserDetailDTO = userDetailService.saveUserDetail(request);

        return ResponseEntity.ok(savedUserDetailDTO);
    }

    // usernickname 중복 체크
    @Operation(summary = "[개인회원] 개인 유저 닉네임 중복 검사", description = "사용자가 설정한 닉네임 값을 통해 닉네임 중복 검사")
    @GetMapping("/duplicate/{nickname}")
    public ResponseEntity<?> checkDuplicateNickname(@PathVariable("nickname") String nickname) {

        boolean isDuplicate = userDetailService.checkDuplicateNickname(nickname);

        if (isDuplicate) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 존재하는 닉네임입니다.");
        }
    }
    
    // 유저 소셜 링크 조회
    @Operation(summary = "[개인회원] 소셜 링크 조회", description = "memberId 값으로 조회")
    @GetMapping("/social/{memberUsername}")
    public ResponseEntity<?> getUserSocialLink(@PathVariable("memberUsername") String memberUsername) {

        UserSocialLinkResponse response = userDetailService.getUserSocialLink(memberUsername);

        return ResponseEntity.ok(response);
    }
    
    
    // 유저 소셜 링크 저장 및 업데이트
    @Operation(summary = "[개인회원] 소셜 링크 저장 및 업데이트", description = "memberId와 socialLink 값으로 설정")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/social/saveOrEdit")
    public ResponseEntity<?> saveUserSocialLink(@AuthenticationPrincipal CustomOAuth2User oauth2User, @RequestBody @Valid
                                                UserSocialLinkRequest request) {

        UserSocialLinkResponse response = userDetailService.saveUserSocialLink(oauth2User, request);

        return ResponseEntity.ok(response);
    }

    // 유저 자기소개 조회
    @Operation(summary = "[개인회원] 유저 자기소개 조회", description = "memberId 값으로 자기소개 조회")
    @GetMapping("/introduction/{memberUsername}")
    public ResponseEntity<?> getUserIntroduction(@PathVariable("memberUsername") String memberUsername) {

        UserIntroductionResponse response = userDetailService.getIntroductionByMemberUsername(memberUsername);

        return ResponseEntity.ok(response);
    }

    // 유저 자기소개 수정 및 저장
    @Operation(summary = "[개인회원] 유저 자기소개 저장 및 수정", description = "유저 자기소개 데이터 저장 또는 수정")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/introduction/saveOrEdit")
    public ResponseEntity<?> saveUserIntroduction(
            @AuthenticationPrincipal CustomOAuth2User oAuth2User,
            @RequestBody @Valid UserIntroductionRequest request) {

        UserIntroductionResponse response = userDetailService.saveIntroduction(oAuth2User, request);

        return ResponseEntity.ok(response);
    }
}