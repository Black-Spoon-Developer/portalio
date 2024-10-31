package com.example.portalio.domain.portfolio.controller;

import com.example.portalio.domain.board.dto.BoardListResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/boards")
public class PortfolioController {


    @Operation(summary = "[자유/질문]글 검색", description = "nickname, boardTitle을 사용해 글 검색")
    @GetMapping
    public ResponseEntity<BoardListResponse> getBoardsSearch(
            @RequestParam(required = false) String nickname,
            @RequestParam(required = false) String boardTitle) {

        BoardListResponse response = boardService.getBoardsSearch(nickname, boardTitle);

        return ResponseEntity.ok(response);
    }
}
