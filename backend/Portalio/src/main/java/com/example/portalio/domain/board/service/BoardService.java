package com.example.portalio.domain.board.service;

import com.example.portalio.domain.board.dto.BoardListResponse;
import com.example.portalio.domain.board.dto.BoardRequest;
import com.example.portalio.domain.board.dto.BoardResponse;
import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.board.repository.BoardRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;

    // nickname, title을 사용한 게시글 검색
    public BoardListResponse getBoardsSearch(String nickname, String boardTitle) {

        List<Board> boards = boardRepository.findByNicknameAndBoardTitle(nickname, boardTitle);

        return BoardListResponse.from(boards);
    }

    // 게시글 상세보기, params : boardId
    public BoardResponse getBoardDetails(Long boardId) {

        Board board = boardRepository.findByBoardId(boardId);

        return BoardResponse.from(board);
    }

    // 페이지네이션, 무한스크롤에 사용하려고 만들어 둠
    // 최신 글 10개씩 가져오는 거임
    public BoardListResponse getBoardList(int skip, int limit) {

        Pageable pageable = PageRequest.of(skip/limit, limit);

        List<Board> boards = boardRepository.findAllByOrderByCreatedDesc(pageable);

        return BoardListResponse.from(boards);
    }

    public BoardResponse registerBoard(BoardRequest request
//            CustomOauth2User oauth2User
            ) {

        // BoardRequest를 Board 엔티티로 변환
        Board board = Board.of(request.getBoardCategory(), request.getBoardTitle(), request.getBoardContent());
        boardRepository.save(board);

        // 저장된 엔티티를 기반으로 BoardResponse 반환
        return BoardResponse.from(board);
    }
}
