package com.example.portalio.domain.boardcomment.service;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.board.error.BoardNotFoundException;
import com.example.portalio.domain.board.repository.BoardRepository;
import com.example.portalio.domain.boardcomment.dto.BoardCommentListResponse;
import com.example.portalio.domain.boardcomment.dto.BoardCommentRequest;
import com.example.portalio.domain.boardcomment.dto.BoardCommentResponse;
import com.example.portalio.domain.boardcomment.entity.BoardComment;
import com.example.portalio.domain.boardcomment.error.BoardCommentNotFoundException;
import com.example.portalio.domain.boardcomment.repository.BoardCommentRepository;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.member.repository.MemberRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardCommentService {

    private final BoardCommentRepository boardCommentRepository;
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    public BoardCommentListResponse getBoardCommentList(Long boardId) {

        Board board = findBoard(boardId);

        List<BoardComment> boardComments = boardCommentRepository.findAllByBoard(board);

        return BoardCommentListResponse.from(boardComments);
    }

    public BoardCommentResponse createBoardComment(BoardCommentRequest request, Long boardId, CustomOAuth2User oauth2User) {

        Board board = findBoard(boardId);

        Member member = findMember(oauth2User.getMemberId());

        BoardComment boardComment = BoardComment.from(request.getContent());

        boardComment.addRelation(board, member);

        boardCommentRepository.save(boardComment);

        return BoardCommentResponse.from(boardComment);
    }

    public BoardCommentResponse updateBoardComment(BoardCommentRequest request, Long boardId, Long commentId, CustomOAuth2User oauth2User) {

        Board board = findBoard(boardId);

        Member member = findMember(oauth2User.getMemberId());

        BoardComment boardComment = boardCommentRepository.findByBoardAndMemberAndBoardCommentId(board, member, commentId)
                .orElseThrow(BoardCommentNotFoundException::new);

        boardComment.setContent(request.getContent());

        boardCommentRepository.save(boardComment);

        return BoardCommentResponse.from(boardComment);
    }

    public BoardCommentResponse deleteBoardComment(Long boardId, Long commentId, CustomOAuth2User oauth2User) {

        Board board = findBoard(boardId);

        Member member = findMember(oauth2User.getMemberId());

        BoardComment boardComment = boardCommentRepository.findByBoardAndMemberAndBoardCommentId(board, member, commentId)
                .orElseThrow(BoardCommentNotFoundException::new);

        boardCommentRepository.delete(boardComment);

        return BoardCommentResponse.from(boardComment);
    }

    private Board findBoard(Long boardId) {
        return boardRepository.findById(boardId)
                .orElseThrow(BoardNotFoundException::new);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
    }
}
