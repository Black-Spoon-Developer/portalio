package com.example.portalio.domain.userdetail.controller;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.userdetail.dto.TicketRankingResponse;
import com.example.portalio.domain.userdetail.dto.TicketResponse;
import com.example.portalio.domain.userdetail.entity.UserDetail;
import com.example.portalio.domain.userdetail.service.UserDetailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/ticket")
public class UserDetailController {

    private final UserDetailService userDetailService;

    @Operation(summary = "티켓 랭킹", description = "티켓 랭킹임")
    @GetMapping("/ranking")
    public ResponseEntity<List<TicketRankingResponse>> getTicketRanking(@RequestParam int page, @RequestParam int size) {
        List<TicketRankingResponse> ranking = userDetailService.getTicketRanking(page, size);
        return ResponseEntity.ok(ranking);
    }

    @Operation(summary = "티켓 추가", description = "활동으로 티켓 추가")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{ticketCount}")
    public ResponseEntity<TicketResponse> updateTicket(
            @RequestParam Integer ticketCount,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        TicketResponse response = userDetailService.updateTicket(ticketCount, oauth2User);

        return ResponseEntity.ok(response);
    }
}
