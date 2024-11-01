package com.example.portalio.domain.repository.service;

import com.example.portalio.domain.repository.dto.RepositoryListResponse;
import com.example.portalio.domain.repository.dto.RepositoryRequest;
import com.example.portalio.domain.repository.dto.RepositoryResponse;
import com.example.portalio.domain.repository.entity.Repository;
import com.example.portalio.domain.repository.error.RepositoryNotFoundExcception;
import com.example.portalio.domain.repository.repository.RepositoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RepositoryService {

    private final RepositoryRepository repositoryRepository;

    public RepositoryResponse getRepositoryDetail(Long repositoryId) {

        Repository repository = repositoryRepository.findByRepositoryId(repositoryId)
                .orElseThrow(RepositoryNotFoundExcception::new);

        return RepositoryResponse.from(repository);
    }

    public RepositoryListResponse getRepositoryList() {

        // 유저 생기면 해당 부분 바꿔야함
        List<Repository> repository = repositoryRepository.findAll();

        return RepositoryListResponse.from(repository);
    }

    @Transactional
    public RepositoryResponse registerRepository(RepositoryRequest request) {

        Repository repository = Repository.of(request.getRepositoryTitle(), request.getRepositoryContent(), request.getStartDate(), request.getEndDate(), request.getPortfolioImgKey(),
                request.getPortfolioFileKey());

        repositoryRepository.save(repository);

        return RepositoryResponse.from(repository);
    }

    @Transactional
    public RepositoryResponse updateRepository(Long repositoryId, RepositoryRequest request) {

        Repository repository = repositoryRepository.findByRepositoryId(repositoryId)
                .orElseThrow(RepositoryNotFoundExcception::new);

        if (request.getRepositoryTitle() != null) {
            repository.setRepositoryTitle(request.getRepositoryTitle());
        }
        if (request.getRepositoryContent() != null) {
            repository.setRepositoryContent(request.getRepositoryContent());
        }
        if (request.getStartDate() != null) {
            repository.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            repository.setEndDate(request.getEndDate());
        }
        if (request.getPortfolioImgKey() != null) {
            repository.setRepositoryImgKey(request.getPortfolioImgKey());
        }
        if (request.getPortfolioFileKey() != null) {
            repository.setRepositoryFileKey(request.getPortfolioFileKey());
        }

        repositoryRepository.save(repository);

        return RepositoryResponse.from(repository);
    }

    @Transactional
    public RepositoryResponse deleteRepository(Long repositoryId) {

        Repository repository = repositoryRepository.findByRepositoryId(repositoryId)
                .orElseThrow(RepositoryNotFoundExcception::new);

        repositoryRepository.delete(repository);

        return RepositoryResponse.from(repository);
    }

}
