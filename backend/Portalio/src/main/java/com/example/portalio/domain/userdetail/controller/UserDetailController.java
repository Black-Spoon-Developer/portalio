package com.example.portalio.domain.userdetail.controller;

import com.example.portalio.domain.userdetail.dto.UserDetailRequest;
import com.example.portalio.domain.userdetail.entity.UserDetail;
import com.example.portalio.domain.userdetail.service.UserDetailService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserDetailController {

    private final UserDetailService userDetailService;

    // userDetail 정보 저장 - 닉네임, 이메일, 멤버Id
    @Operation(summary = "[개인회원] 회원 세부 정보 저장", description = "닉네임, 이메일, memberId의 값을 보내주어 저장")
    @PostMapping("/detail")
    public ResponseEntity<?> saveUserDetail(UserDetailRequest request) {

        UserDetail savedUserDetail = userDetailService.saveUserDetail(request);

        return ResponseEntity.ok(savedUserDetail);
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

}
