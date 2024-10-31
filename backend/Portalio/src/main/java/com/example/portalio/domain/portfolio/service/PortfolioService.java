package com.example.portalio.domain.portfolio.service;

import com.example.portalio.domain.board.dto.BoardListResponse;
import com.example.portalio.domain.board.entity.Board;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PortfolioService {

    // nickname, title을 사용한 게시글 검색
    public BoardListResponse getPortfolioSearch(String boardTitle) {

        List<Board> boards = boardRepository.findByNicknameAndBoardTitle(nickname, boardTitle);

        return BoardListResponse.from(boards);
    }
}
