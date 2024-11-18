package com.example.portalio.domain.portfolio.service;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.jobsubcategory.entity.JobSubCategory;
import com.example.portalio.domain.jobsubcategory.error.JobSubCategoryNotFoundException;
import com.example.portalio.domain.jobsubcategory.repository.JobSubCategoryRepository;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.member.repository.MemberRepository;
import com.example.portalio.domain.portfolio.dto.PortfolioLikeListResponse;
import com.example.portalio.domain.portfolio.dto.PortfolioLikeResponse;
import com.example.portalio.domain.portfolio.dto.PortfolioListResponse;
import com.example.portalio.domain.portfolio.dto.PortfolioPostResponse;
import com.example.portalio.domain.portfolio.dto.PortfolioRequest;
import com.example.portalio.domain.portfolio.dto.PortfolioResponse;
import com.example.portalio.domain.portfolio.entity.Portfolio;
import com.example.portalio.domain.portfolio.error.PortfolioNotFoundException;
import com.example.portalio.domain.portfolio.repository.PortfolioRepository;
import com.example.portalio.domain.portfoliorecom.entity.PortfolioRecom;
import com.example.portalio.domain.portfoliorecom.repository.PortfolioRecomRepository;
import com.example.portalio.domain.userdetail.entity.UserDetail;
import com.example.portalio.domain.userdetail.error.NoUserDetailException;
import com.example.portalio.domain.userdetail.repository.UserDetailRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final JobSubCategoryRepository jobSubCategoryRepository;
    private final MemberRepository memberRepository;
    private final UserDetailRepository userDetailRepository;
    private final PortfolioRecomRepository portfolioRecomRepository;

    // jobId, title을 사용한 게시글 검색
    public PortfolioLikeListResponse getPortfolioSearch(Long portfolioJobId, String portfolioTitle, CustomOAuth2User oauth2User) {

        List<Portfolio> portfolios = portfolioRepository.findByJobSubCategoryJobIdAndPortfolioTitle(portfolioJobId, portfolioTitle);

        Map<Long, Boolean> likeStatusMap = new HashMap<>();
        if (oauth2User != null) {
            // 인증된 경우 좋아요 상태를 조회
            Member member = findMember(oauth2User.getMemberId());

            List<PortfolioRecom> likes = portfolioRecomRepository.findAllByMemberAndPortfolioIn(member, portfolios);
            likeStatusMap = likes.stream()
                    .collect(Collectors.toMap(recom -> recom.getPortfolio().getPortfolioId(), recom -> true));
        }

        return PortfolioLikeListResponse.from(portfolios, likeStatusMap);
    }

    // 게시글 상세보기, params : portfolioId
    public PortfolioLikeResponse getPortfolioDetails(Long portfolioId, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(PortfolioNotFoundException::new);

        portfolio.setPortfolioViews(portfolio.getPortfolioViews() + 1);

        portfolioRepository.save(portfolio);

        Boolean likeStatus = portfolioRecomRepository.existsByMemberAndPortfolio(member, portfolio);

        return PortfolioLikeResponse.from(portfolio, likeStatus);
    }

    // 페이지네이션, 무한스크롤에 사용하려고 만들어 둠
    // 최신 글 10개씩 가져오는 거임
    @Transactional
    public PortfolioLikeListResponse getPortfolioList(int skip, int limit, CustomOAuth2User oauth2User) {
        Pageable pageable = PageRequest.of(skip / limit, limit);

        List<Portfolio> portfolios = portfolioRepository.findAllByPortfolioPostTrueOrderByCreatedDesc(pageable);

        Map<Long, Boolean> likeStatusMap = new HashMap<>();
        if (oauth2User != null) {
            Member member = findMember(oauth2User.getMemberId());

            List<PortfolioRecom> likes = portfolioRecomRepository.findAllByMemberAndPortfolioIn(member, portfolios);
            likeStatusMap = likes.stream()
                    .collect(Collectors.toMap(recom -> recom.getPortfolio().getPortfolioId(), recom -> true));
        }

        return PortfolioLikeListResponse.from(portfolios, likeStatusMap);
    }


    public PortfolioListResponse getMyPortfolioList(int skip, int limit, String username) {

        Member member = memberRepository.findByMemberUsername(username)
                .orElseThrow(MemberNotFoundException::new);

        Pageable pageable = PageRequest.of(skip/limit, limit);

        List<Portfolio> portfolios = portfolioRepository.findAllByMember_MemberIdOrderByCreatedDesc(member.getMemberId(), pageable);

        return PortfolioListResponse.from(portfolios);
    }

    // 게시글 등록
    @Transactional
    public PortfolioResponse registerPortfolio(PortfolioRequest request, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        JobSubCategory jobSubCategory = findJobSubCategory(request.getJobSubCategoryId());

        // PortfolioRequest를 Portfolio 엔티티로 변환
        Portfolio portfolio = Portfolio.of(request.getPortfolioTitle(),request. getPortfolioDescription(), request.getPortfolioContent(), request.getPortfolioThumbnailImg(), request.getPortfolioPost(), jobSubCategory, member);

        portfolioRepository.save(portfolio);



        // 저장된 엔티티를 기반으로 PortfolioResponse 반환
        return PortfolioResponse.from(portfolio);
    }

    @Transactional
    public PortfolioResponse updatePortfolio(Long portfoliosId, PortfolioRequest request, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Portfolio portfolio = portfolioRepository.findByPortfolioIdAndMember_MemberId(portfoliosId, member.getMemberId())
                .orElseThrow(PortfolioNotFoundException::new);

        if (request.getPortfolioTitle() != null) {
            portfolio.setPortfolioTitle(request.getPortfolioTitle());
        }
        if (request.getPortfolioDescription() != null) {
            portfolio.setPortfolioDescription(request.getPortfolioDescription());
        }
        if (request.getPortfolioContent() != null) {
            portfolio.setPortfolioContent(request.getPortfolioContent());
        }
        if (request.getJobSubCategoryId() != null) {
            JobSubCategory jobSubCategory = findJobSubCategory(request.getJobSubCategoryId());
            portfolio.setJobSubCategory(jobSubCategory);
        }
        if (request.getPortfolioThumbnailImg() != null) {
            portfolio.setPortfolioThumbnailImg(request.getPortfolioThumbnailImg());
        }

        portfolioRepository.save(portfolio);

        return PortfolioResponse.from(portfolio);
    }

    @Transactional
    public PortfolioResponse deletePortfolio(Long portfoliosId, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Portfolio portfolio = portfolioRepository.findByPortfolioIdAndMember_MemberId(portfoliosId, member.getMemberId())
                .orElseThrow(PortfolioNotFoundException::new);

        portfolioRepository.delete(portfolio);

        return PortfolioResponse.from(portfolio);
    }

    @Transactional
    public PortfolioPostResponse primaryPortfolio(Long portfoliosId, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Portfolio portfolio = portfolioRepository.findByPortfolioIdAndMember_MemberId(portfoliosId, member.getMemberId())
                .orElseThrow(PortfolioNotFoundException::new);

        portfolio.setPortfolioIsPrimary(!portfolio.getPortfolioIsPrimary());

        portfolioRepository.save(portfolio);

        return PortfolioPostResponse.from(portfolio);
    }

    @Transactional
    public PortfolioPostResponse postPortfolio(Long portfoliosId, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Portfolio portfolio = portfolioRepository.findByPortfolioIdAndMember_MemberId(portfoliosId, member.getMemberId())
                .orElseThrow(PortfolioNotFoundException::new);

        portfolio.setPortfolioPost(!portfolio.getPortfolioPost());

        portfolioRepository.save(portfolio);

        return PortfolioPostResponse.from(portfolio);
    }

    public PortfolioListResponse getTop10Portfolios() {

        Pageable topTen = PageRequest.of(0, 5); // 첫 번째 페이지, 5개 항목

        List<Portfolio> portfolios = portfolioRepository.findTopPortfolios(topTen);


        return PortfolioListResponse.from(portfolios);
    }

    private JobSubCategory findJobSubCategory(Long jobId) {
        return jobSubCategoryRepository.findById(jobId)
                .orElseThrow(JobSubCategoryNotFoundException::new);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
    }
}
