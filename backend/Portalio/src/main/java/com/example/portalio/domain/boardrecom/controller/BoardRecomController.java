package com.example.portalio.domain.boardrecom.controller;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.board.dto.BoardResponse;
import com.example.portalio.domain.boardrecom.dto.BoardRecomResponse;
import com.example.portalio.domain.boardrecom.service.BoardRecomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/boards")
public class BoardRecomController {

    private final BoardRecomService boardRecomService;

    @Operation(summary = "[자유/질문]게시글 추천", description = "게시글 추천")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{boardId}/recom")
    public ResponseEntity<BoardRecomResponse> BoardRecom(
            @PathVariable Long boardId,
            @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        BoardRecomResponse response = boardRecomService.boardRecom(boardId, oauth2User);

        return ResponseEntity.ok(response);
    }

}
