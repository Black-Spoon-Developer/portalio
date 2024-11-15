package com.example.portalio.domain.portfoliocomment.service;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.member.repository.MemberRepository;
import com.example.portalio.domain.portfolio.entity.Portfolio;
import com.example.portalio.domain.portfolio.error.PortfolioNotFoundException;
import com.example.portalio.domain.portfolio.repository.PortfolioRepository;
import com.example.portalio.domain.portfoliocomment.dto.PortfolioCommentListResponse;
import com.example.portalio.domain.portfoliocomment.dto.PortfolioCommentRequest;
import com.example.portalio.domain.portfoliocomment.dto.PortfolioCommentResponse;
import com.example.portalio.domain.portfoliocomment.entity.PortfolioComment;
import com.example.portalio.domain.portfoliocomment.error.PortfolioCommentNotFoundException;
import com.example.portalio.domain.portfoliocomment.repository.PortfolioCommentRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PortfolioCommentService {

    private final PortfolioCommentRepository portfolioCommentRepository;
    private final PortfolioRepository portfolioRepository;
    private final MemberRepository memberRepository;

    public PortfolioCommentListResponse getPortfolioCommentList(Long portfolioId) {

        Portfolio portfolio = findPortfolio(portfolioId);

        List<PortfolioComment> portfolioComments = portfolioCommentRepository.findAllByPortfolio(portfolio);

        return PortfolioCommentListResponse.from(portfolioComments);
    }

    public PortfolioCommentResponse createPortfolioComment(PortfolioCommentRequest request, Long portfolioId, CustomOAuth2User oauth2User) {

        Portfolio portfolio = findPortfolio(portfolioId);

        Member member = findMember(oauth2User.getMemberId());

        PortfolioComment portfolioComment = PortfolioComment.from(request.getContent());

        portfolioComment.addRelation(portfolio, member);

        portfolioCommentRepository.save(portfolioComment);

        return PortfolioCommentResponse.from(portfolioComment);
    }

    public PortfolioCommentResponse updatePortfolioComment(PortfolioCommentRequest request, Long portfolioId, Long commentId, CustomOAuth2User oauth2User) {

        Portfolio portfolio = findPortfolio(portfolioId);

        Member member = findMember(oauth2User.getMemberId());

        PortfolioComment portfolioComment = portfolioCommentRepository.findByPortfolioAndMemberAndPortfolioCommentId(portfolio, member, commentId)
                .orElseThrow(PortfolioCommentNotFoundException::new);

        portfolioComment.setContent(request.getContent());

        portfolioCommentRepository.save(portfolioComment);

        return PortfolioCommentResponse.from(portfolioComment);
    }

    public PortfolioCommentResponse deletePortfolioComment(Long portfolioId, Long commentId, CustomOAuth2User oauth2User) {

        Portfolio portfolio = findPortfolio(portfolioId);

        Member member = findMember(oauth2User.getMemberId());

        PortfolioComment portfolioComment = portfolioCommentRepository.findByPortfolioAndMemberAndPortfolioCommentId(portfolio, member, commentId)
                .orElseThrow(PortfolioCommentNotFoundException::new);

        portfolioCommentRepository.delete(portfolioComment);

        return PortfolioCommentResponse.from(portfolioComment);
    }

    private Portfolio findPortfolio(Long portfolioId) {
        return portfolioRepository.findById(portfolioId)
                .orElseThrow(PortfolioNotFoundException::new);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
    }
}
