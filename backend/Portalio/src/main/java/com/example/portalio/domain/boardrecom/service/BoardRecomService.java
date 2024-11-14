package com.example.portalio.domain.boardrecom.service;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.board.error.BoardNotFoundException;
import com.example.portalio.domain.board.repository.BoardRepository;
import com.example.portalio.domain.boardrecom.dto.BoardRecomResponse;
import com.example.portalio.domain.boardrecom.entity.BoardRecom;
import com.example.portalio.domain.boardrecom.error.AlreadyBoardRecomException;
import com.example.portalio.domain.boardrecom.repository.BoardRecomRepository;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BoardRecomService {

    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    private final BoardRecomRepository boardRecomRepository;

    @Transactional
    public BoardRecomResponse boardRecom(Long boardId, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Board board = boardRepository.findById(boardId)
                .orElseThrow(BoardNotFoundException::new);

        BoardRecom boardRecom = boardRecomRepository.findByMemberAndBoard(member, board)
                .orElse(null);

        if (boardRecom != null) {
            boardRecomRepository.delete(boardRecom);

            board.setBoardRecommendationCount(board.getBoardRecommendationCount() - 1);
            boardRepository.save(board);

            return BoardRecomResponse.cancel(boardRecom);
        }

        BoardRecom buildoardRecom = BoardRecom.of(member, board);

        boardRecomRepository.save(buildoardRecom);

        board.setBoardRecommendationCount(board.getBoardRecommendationCount() + 1);

        boardRepository.save(board);

        return BoardRecomResponse.from(buildoardRecom);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
    }

}
