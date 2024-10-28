package com.example.portalio.domain.board.service;

import com.example.portalio.domain.board.dto.BoardListResponse;
import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.board.repository.BoardRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;

    public BoardListResponse getBoardList() {

        List<Board> boards = boardRepository.findTop10ByCreatedDateDesc();
        // 최신 글 10개만 가져오는 거임

        return BoardListResponse.from(boards);
    }
}
