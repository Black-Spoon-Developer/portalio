package com.example.portalio.domain.board.service;

import com.example.portalio.domain.board.dto.BoardListResponse;
import com.example.portalio.domain.board.dto.BoardRequest;
import com.example.portalio.domain.board.dto.BoardResponse;
import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.board.error.BoardNotFoundException;
import com.example.portalio.domain.board.repository.BoardRepository;
import com.example.portalio.s3.service.AwsS3Service;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final AwsS3Service awsS3Service;

    // nickname, title을 사용한 게시글 검색
    public BoardListResponse getBoardsSearch(String nickname, String boardTitle) {

        List<Board> boards = boardRepository.findByNicknameAndBoardTitle(nickname, boardTitle);

        return BoardListResponse.from(boards);
    }

    // 게시글 상세보기, params : boardId
    public BoardResponse getBoardDetails(Long boardId) {

        Board board = boardRepository.findByBoardId(boardId)
                .orElseThrow(BoardNotFoundException::new);

        return BoardResponse.from(board);
    }

    // 페이지네이션, 무한스크롤에 사용하려고 만들어 둠
    // 최신 글 10개씩 가져오는 거임
    public BoardListResponse getBoardList(int skip, int limit) {

        Pageable pageable = PageRequest.of(skip/limit, limit);

        List<Board> boards = boardRepository.findAllByOrderByCreatedDesc(pageable);

        return BoardListResponse.from(boards);
    }

    // 게시글 등록
    @Transactional
    public BoardResponse registerBoard(BoardRequest request
//            CustomOauth2User oauth2User
            ) {

        // BoardRequest를 Board 엔티티로 변환
        Board board = Board.of(request.getBoardCategory(), request.getBoardTitle(), request.getBoardContent(),
                request.getBoardImgKey());

        boardRepository.save(board);

        // 저장된 엔티티를 기반으로 BoardResponse 반환
        return BoardResponse.from(board);
    }

    @Transactional
    public BoardResponse updateBoard(Long boardId, BoardRequest request) {

        Board board = boardRepository.findByBoardId(boardId)
                .orElseThrow(BoardNotFoundException::new);

        if (request.getBoardCategory() != null) {
            board.setBoardCategory(request.getBoardCategory());
        }
        if (request.getBoardTitle() != null) {
            board.setBoardTitle(request.getBoardTitle());
        }
        if (request.getBoardContent() != null) {
            board.setBoardContent(request.getBoardContent());
        }
        if (request.getBoardImgKey() != null) {
            board.setBoardImgKey(request.getBoardImgKey());
        }

        boardRepository.save(board);

        return BoardResponse.from(board);
    }

    @Transactional
    public BoardResponse deleteBoard(Long boardId) {

        Board board = boardRepository.findByBoardId(boardId)
                .orElseThrow(BoardNotFoundException::new);

        boardRepository.delete(board);

        return BoardResponse.from(board);
    }
}
