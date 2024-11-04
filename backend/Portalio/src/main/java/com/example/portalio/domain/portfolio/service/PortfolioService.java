package com.example.portalio.domain.portfolio.service;

import com.example.portalio.domain.jobsubcategory.entity.JobSubCategory;
import com.example.portalio.domain.jobsubcategory.error.JobSubCategoryNotFoundException;
import com.example.portalio.domain.jobsubcategory.repository.JobSubCategoryRepository;
import com.example.portalio.domain.portfolio.dto.PortfolioListResponse;
import com.example.portalio.domain.portfolio.dto.PortfolioPostResponse;
import com.example.portalio.domain.portfolio.dto.PortfolioRequest;
import com.example.portalio.domain.portfolio.dto.PortfolioResponse;
import com.example.portalio.domain.portfolio.entity.Portfolio;
import com.example.portalio.domain.portfolio.error.PortfolioNotFoundException;
import com.example.portalio.domain.portfolio.repository.PortfolioRepository;
import java.util.List;
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

    // jobId, title을 사용한 게시글 검색
    public PortfolioListResponse getPortfolioSearch(Long portfolioJobId, String portfolioTitle) {

        List<Portfolio> portfolios = portfolioRepository.findByJobSubCategoryJobIdAndPortfolioTitle(portfolioJobId, portfolioTitle);

        return PortfolioListResponse.from(portfolios);
    }

    // 게시글 상세보기, params : portfolioId
    public PortfolioResponse getPortfolioDetails(Long portfolioId) {

        Portfolio portfolio = portfolioRepository.findByPortfolioId(portfolioId)
                .orElseThrow(PortfolioNotFoundException::new);

        return PortfolioResponse.from(portfolio);
    }

    // 페이지네이션, 무한스크롤에 사용하려고 만들어 둠
    // 최신 글 10개씩 가져오는 거임
    public PortfolioListResponse getPortfolioList(int skip, int limit) {

        Pageable pageable = PageRequest.of(skip/limit, limit);

        List<Portfolio> portfolios = portfolioRepository.findAllByPortfolioPostTrueOrderByCreatedDesc(pageable);

        return PortfolioListResponse.from(portfolios);
    }

    // 게시글 등록
    @Transactional
    public PortfolioResponse registerPortfolio(PortfolioRequest request
//            CustomOauth2User oauth2User
    ) {

        JobSubCategory jobSubCategory = findJobSubCategory(request.getJobSubCategoryId());

        // PortfolioRequest를 Portfolio 엔티티로 변환
        Portfolio portfolio = Portfolio.of(request.getPortfolioTitle(), request.getPortfolioContent(), request.getPortfolioImgKey(), request.getPortfolioFileKey(), request.getPortfolioThumbnailImg(), jobSubCategory);

        portfolioRepository.save(portfolio);

        // 저장된 엔티티를 기반으로 PortfolioResponse 반환
        return PortfolioResponse.from(portfolio);
    }

    @Transactional
    public PortfolioResponse updatePortfolio(Long portfoliosId, PortfolioRequest request) {



        Portfolio portfolio = portfolioRepository.findByPortfolioId(portfoliosId)
                .orElseThrow(PortfolioNotFoundException::new);

        if (request.getPortfolioTitle() != null) {
            portfolio.setPortfolioTitle(request.getPortfolioTitle());
        }
        if (request.getPortfolioContent() != null) {
            portfolio.setPortfolioContent(request.getPortfolioContent());
        }
        if (request.getJobSubCategoryId() != null) {
            JobSubCategory jobSubCategory = findJobSubCategory(request.getJobSubCategoryId());
            portfolio.setJobSubCategory(jobSubCategory);
        }
        if (request.getPortfolioImgKey() != null) {
            portfolio.setPortfolioImgKey(request.getPortfolioImgKey());
        }
        if (request.getPortfolioFileKey() != null) {
            portfolio.setPortfolioFileKey(request.getPortfolioFileKey());
        }
        if (request.getPortfolioThumbnailImg() != null) {
            portfolio.setPortfolioThumbnailImg(request.getPortfolioThumbnailImg());
        }

        portfolioRepository.save(portfolio);

        return PortfolioResponse.from(portfolio);
    }

    @Transactional
    public PortfolioResponse deletePortfolio(Long portfoliosId) {

        Portfolio portfolio = portfolioRepository.findByPortfolioId(portfoliosId)
                .orElseThrow(PortfolioNotFoundException::new);

        portfolioRepository.delete(portfolio);

        return PortfolioResponse.from(portfolio);
    }

    @Transactional
    public PortfolioPostResponse postPortfolio(Long portfoliosId) {

        Portfolio portfolio = portfolioRepository.findByPortfolioId(portfoliosId)
                .orElseThrow(PortfolioNotFoundException::new);

        portfolio.setPortfolioPost(!portfolio.getPortfolioPost());

        portfolioRepository.save(portfolio);

        return PortfolioPostResponse.from(portfolio);
    }

    private JobSubCategory findJobSubCategory(Long jobId) {
        return jobSubCategoryRepository.findById(jobId)
                .orElseThrow(JobSubCategoryNotFoundException::new);
    }
}
