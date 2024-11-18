package com.example.portalio.domain.board.service;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.board.dto.BoardLikeListResponse;
import com.example.portalio.domain.board.dto.BoardLikeResponse;
import com.example.portalio.domain.board.dto.BoardListResponse;
import com.example.portalio.domain.board.dto.BoardRequest;
import com.example.portalio.domain.board.dto.BoardResponse;
import com.example.portalio.domain.board.dto.BoardSolveResponse;
import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.board.enums.BoardRole;
import com.example.portalio.domain.board.error.BoardNotFoundException;
import com.example.portalio.domain.board.error.BoardUnauthorizedAccessException;
import com.example.portalio.domain.board.repository.BoardRepository;
import com.example.portalio.domain.boardrecom.entity.BoardRecom;
import com.example.portalio.domain.boardrecom.repository.BoardRecomRepository;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.member.repository.MemberRepository;
import com.example.portalio.domain.portfoliorecom.entity.PortfolioRecom;
import com.example.portalio.s3.service.AwsS3Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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
    private final BoardRecomRepository boardRecomRepository;
    private final MemberRepository memberRepository;

    // nickname, title을 사용한 게시글 검색
    public BoardLikeListResponse getBoardsSearch(String boardTitle, BoardRole boardCategory, CustomOAuth2User oauth2User) {

        List<Board> boards = boardRepository.findByBoardTitleAndCategory(boardTitle, boardCategory);

        Map<Long, Boolean> likeStatusMap = new HashMap<>();
        if (oauth2User != null) {
            // 인증된 경우 좋아요 상태를 조회
            Member member = findMember(oauth2User.getMemberId());

            List<BoardRecom> likes = boardRecomRepository.findAllByMemberAndBoardIn(member, boards);
            likeStatusMap = likes.stream()
                    .collect(Collectors.toMap(recom -> recom.getBoard().getBoardId(), recom -> true));
        }

        return BoardLikeListResponse.from(boards, likeStatusMap);
    }

    // 게시글 상세보기, params : boardId
    public BoardLikeResponse getBoardDetails(Long boardId, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Board board = boardRepository.findById(boardId)
                .orElseThrow(BoardNotFoundException::new);

        board.setBoardViews(board.getBoardViews() + 1);

        boardRepository.save(board);

        Boolean likeStatus = boardRecomRepository.existsByMemberAndBoard(member, board);

        return BoardLikeResponse.from(board, likeStatus);
    }

    // 페이지네이션, 무한스크롤에 사용하려고 만들어 둠
    // 최신 글 10개씩 가져오는 거임
    public BoardLikeListResponse getBoardList(int skip, int limit, BoardRole boardCategory, CustomOAuth2User oauth2User) {

        Pageable pageable = PageRequest.of(skip/limit, limit);

        List<Board> boards = boardRepository.findByBoardCategoryOrderByCreatedDesc(boardCategory, pageable);

        Map<Long, Boolean> likeStatusMap = new HashMap<>();
        if (oauth2User != null) {
            // 인증된 경우 좋아요 상태를 조회
            Member member = findMember(oauth2User.getMemberId());

            List<BoardRecom> likes = boardRecomRepository.findAllByMemberAndBoardIn(member, boards);
            likeStatusMap = likes.stream()
                    .collect(Collectors.toMap(recom -> recom.getBoard().getBoardId(), recom -> true));
        }

        return BoardLikeListResponse.from(boards, likeStatusMap);
    }

    // BoardService.java
    public BoardListResponse getMyBoardList(int skip, int limit, BoardRole boardCategory, String username) {

        Member member = memberRepository.findByMemberUsername(username)
                .orElseThrow(MemberNotFoundException::new);

        Pageable pageable = PageRequest.of(skip / limit, limit);

        List<Board> boards = boardRepository.findAllByMember_MemberIdAndBoardCategoryOrderByCreatedDesc(member.getMemberId(), boardCategory, pageable);

        return BoardListResponse.from(boards);
    }


    // 게시글 등록
    @Transactional
    public BoardResponse registerBoard(BoardRequest request, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());
        // BoardRequest를 Board 엔티티로 변환
        Board board = Board.of(request.getBoardCategory(), request.getBoardTitle(), request.getBoardContent(), request.getBoardThumbnailImg(),
                 member);

        boardRepository.save(board);

        // 저장된 엔티티를 기반으로 BoardResponse 반환
        return BoardResponse.from(board);
    }

    @Transactional
    public BoardResponse updateBoard(Long boardId, BoardRequest request, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Board board = boardRepository.findByBoardIdAndMember_MemberId(boardId, member.getMemberId())
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
        if (request.getBoardThumbnailImg() != null) {
            board.setBoardThumbnailImg(request.getBoardThumbnailImg());
        }

        boardRepository.save(board);

        return BoardResponse.from(board);
    }

    @Transactional
    public BoardResponse deleteBoard(Long boardId, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Board board = boardRepository.findByBoardIdAndMember_MemberId(boardId, member.getMemberId())
                .orElseThrow(BoardNotFoundException::new);

        boardRepository.delete(board);

        return BoardResponse.from(board);
    }

    @Transactional
    public BoardSolveResponse solveBoard(Long boardId, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Board board = boardRepository.findByBoardIdAndMember_MemberId(boardId, member.getMemberId())
                .orElseThrow(BoardUnauthorizedAccessException::new);

        if (!board.getBoardSolve()) {
            board.setBoardSolve(true);
        }

        boardRepository.save(board);

        return BoardSolveResponse.from(board);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
    }
}
