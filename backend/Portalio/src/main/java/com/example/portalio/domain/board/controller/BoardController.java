package com.example.portalio.domain.board.controller;

import com.example.portalio.domain.board.dto.BoardListResponse;
import com.example.portalio.domain.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/boards")
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/")
    public ResponseEntity<BoardListResponse> getBoardsList() {

        BoardListResponse response = boardService.getBoardList();

        return ResponseEntity.ok(response);
    }
}
