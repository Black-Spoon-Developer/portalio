package com.example.portalio.domain.portfoliorecom.service;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.member.repository.MemberRepository;
import com.example.portalio.domain.portfolio.entity.Portfolio;
import com.example.portalio.domain.portfolio.error.PortfolioNotFoundException;
import com.example.portalio.domain.portfolio.repository.PortfolioRepository;
import com.example.portalio.domain.portfoliorecom.dto.PortfolioRecomResponse;
import com.example.portalio.domain.portfoliorecom.entity.PortfolioRecom;
import com.example.portalio.domain.portfoliorecom.error.AlreadyPortfolioRecomException;
import com.example.portalio.domain.portfoliorecom.repository.PortfolioRecomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PortfolioRecomService {

    private final MemberRepository memberRepository;
    private final PortfolioRepository portfolioRepository;
    private final PortfolioRecomRepository portfolioRecomRepository;

    @Transactional
    public PortfolioRecomResponse portfolioRecom(Long portfolioId, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(PortfolioNotFoundException::new);

        PortfolioRecom existPortfolioRecom = portfolioRecomRepository.findByMemberAndPortfolio(member, portfolio);
        
        // 만약 기존에 추천을 했다면
        if (existPortfolioRecom != null) {
            portfolioRecomRepository.delete(existPortfolioRecom);
            portfolio.setPortfolioRecommendationCount(portfolio.getPortfolioRecommendationCount() - 1);
            portfolioRepository.save(portfolio);

            return PortfolioRecomResponse.cancel();

        }

        PortfolioRecom portfolioRecom = PortfolioRecom.of(member, portfolio);

        portfolioRecomRepository.save(portfolioRecom);

        portfolio.setPortfolioRecommendationCount(portfolio.getPortfolioRecommendationCount() + 1);

        portfolioRepository.save(portfolio);

        return PortfolioRecomResponse.from(portfolioRecom);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
    }

}
