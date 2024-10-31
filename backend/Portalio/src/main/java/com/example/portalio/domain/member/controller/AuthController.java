package com.example.portalio.domain.member.controller;

import com.example.portalio.common.jwt.dto.StatusResponseDto;
import com.example.portalio.common.jwt.util.JwtUtil;
import com.example.portalio.common.refreshtoken.repository.RefreshTokenRepository;
import com.example.portalio.common.refreshtoken.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class AuthController {

    private final RefreshTokenRepository tokenRepository;
    private final RefreshTokenService tokenService;
    private final JwtUtil jwtUtil;

    @PostMapping("/logout")
    public ResponseEntity<StatusResponseDto> logout(@RequestHeader("Authorization") final String accessToken) {

        // 엑세스 토큰으로 현재 Redis 정보 삭제
        tokenService.removeRefreshToken(accessToken);
        return ResponseEntity.ok(StatusResponseDto.addStatus(200));
    }

}
