package com.example.portalio.domain.board.controller;

import com.example.portalio.domain.board.dto.BoardListResponse;
import com.example.portalio.domain.board.dto.BoardRequest;
import com.example.portalio.domain.board.dto.BoardResponse;
import com.example.portalio.domain.board.service.BoardService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/v1/boards")
public class BoardController {

    private final BoardService boardService;

    @Operation(summary = "[자유/질문]글 검색", description = "nickname, boardTitle을 사용해 글 검색")
    @GetMapping
    public ResponseEntity<BoardListResponse> getBoardsSearch(
            @RequestParam(required = false) String nickname,
            @RequestParam(required = false) String boardTitle) {

        BoardListResponse response = boardService.getBoardsSearch(nickname, boardTitle);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[자유/질문]글 상세보기", description = "boards_id 입력")
    @GetMapping("/{boardsId}")
    public ResponseEntity<BoardResponse> getBoardsDetail(@PathVariable("boardsId") Long boardsId) {

        BoardResponse response = boardService.getBoardDetails(boardsId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[자유/질문]글 전체보기(리스트)", description = "무한스크롤, 사용시 skip을 10씩 증가해서 넣으세요, limit 10 고정")
    @GetMapping("/all")
    public ResponseEntity<BoardListResponse> getBoardsList(
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit) {

        BoardListResponse response = boardService.getBoardList(skip, limit);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[자유/질문]글 작성", description = "글 작성")
    //@PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<BoardResponse> getBoardsSearch(
            @RequestBody @Valid BoardRequest request
            //@AuthenticationPrincipal CustomOauth2User oauth2User
            // 로그인 구현 후 주석 해제
    ) {

        BoardResponse response = boardService.registerBoard(request);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "[자유/질문]글 수정", description = "글 수정")
//    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{boardId}")
    public ResponseEntity<BoardResponse> updateBoard(
            @PathVariable Long boardId,
            @RequestBody @Valid BoardRequest request
            //@AuthenticationPrincipal CustomOauth2User oauth2User
            // 로그인 구현 후 주석 해제
    ) {
        BoardResponse response = boardService.updateBoard(boardId, request);

        return ResponseEntity.ok(response);
    }
}
