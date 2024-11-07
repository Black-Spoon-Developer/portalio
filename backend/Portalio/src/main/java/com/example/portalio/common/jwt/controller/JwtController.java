package com.example.portalio.common.jwt.controller;

import com.example.portalio.common.jwt.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class JwtController {

    private final JwtService jwtService;

    public JwtController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    // 엑세스 토큰 발급
    @PostMapping("/token/issue")
    public ResponseEntity<?> issue(HttpServletRequest request, HttpServletResponse response) {

        return jwtService.issue(request, response);
    }
}