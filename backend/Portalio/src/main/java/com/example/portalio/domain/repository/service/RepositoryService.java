package com.example.portalio.domain.repository.service;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.member.error.NotPermissionException;
import com.example.portalio.domain.member.repository.MemberRepository;
import com.example.portalio.domain.repository.dto.RepositoryListResponse;
import com.example.portalio.domain.repository.dto.RepositoryPostResponse;
import com.example.portalio.domain.repository.dto.RepositoryRequest;
import com.example.portalio.domain.repository.dto.RepositoryResponse;
import com.example.portalio.domain.repository.entity.Repository;
import com.example.portalio.domain.repository.error.RepositoryNotFoundException;
import com.example.portalio.domain.repository.repository.RepositoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RepositoryService {

    private final RepositoryRepository repositoryRepository;
    private final MemberRepository memberRepository;

    public RepositoryResponse getRepositoryDetail(Long repositoryId) {

        Repository repository = repositoryRepository.findById(repositoryId)
                .orElseThrow(RepositoryNotFoundException::new);

        return RepositoryResponse.from(repository);
    }

    public RepositoryListResponse getRepositoryList(int skip, int limit) {

        Pageable pageable = PageRequest.of(skip/limit, limit);

        List<Repository> repository = repositoryRepository.findAllByRepositoryPostTrueOrderByCreatedDesc(pageable);

        return RepositoryListResponse.from(repository);
    }

    public RepositoryListResponse getMyRepositoryList(CustomOAuth2User oauth2User, String username) {

        Member member = memberRepository.findByMemberUsername(oauth2User.getUsername())
                .orElseThrow(MemberNotFoundException::new);

        if (!oauth2User.getUsername().equals(username)) {
            throw new NotPermissionException();
        }

        List<Repository> repository = repositoryRepository.findAllByMember_MemberUsername(member.getMemberUsername());

        return RepositoryListResponse.from(repository);
    }

    @Transactional
    public RepositoryResponse registerRepository(RepositoryRequest request, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Repository repository = Repository.of(request.getRepositoryTitle(), request.getRepositoryDescription(), request.getRepositoryContent(), request.getStartDate(), request.getEndDate(),
                request.getRepositoryFileKey(), request.getRepositoryPost(), member);

        repositoryRepository.save(repository);

        return RepositoryResponse.from(repository);
    }

    @Transactional
    public RepositoryResponse updateRepository(Long repositoryId, RepositoryRequest request, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Repository repository = repositoryRepository.findByRepositoryIdAndMember_MemberId(repositoryId, member.getMemberId())
                .orElseThrow(RepositoryNotFoundException::new);

        if (request.getRepositoryTitle() != null) {
            repository.setRepositoryTitle(request.getRepositoryTitle());
        }
        if (request.getRepositoryDescription() != null) {
            repository.setRepositoryDescription(request.getRepositoryDescription());
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
        if (request.getRepositoryFileKey() != null) {
            repository.setRepositoryFileKey(request.getRepositoryFileKey());
        }
        if (request.getRepositoryPost() != null) {
            repository.setRepositoryPost(request.getRepositoryPost());
        }

        repositoryRepository.save(repository);

        return RepositoryResponse.from(repository);
    }

    @Transactional
    public RepositoryResponse deleteRepository(Long repositoryId, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Repository repository = repositoryRepository.findByRepositoryIdAndMember_MemberId(repositoryId, member.getMemberId())
                .orElseThrow(RepositoryNotFoundException::new);

        repositoryRepository.delete(repository);

        return RepositoryResponse.from(repository);
    }


    @Transactional
    public RepositoryPostResponse postRepository(Long repositoryId, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Repository repository = repositoryRepository.findByRepositoryIdAndMember_MemberId(repositoryId, member.getMemberId())
                        .orElseThrow(RepositoryNotFoundException::new);

        repository.setRepositoryPost(!repository.getRepositoryPost());

        repositoryRepository.save(repository);

        return RepositoryPostResponse.from(repository);
    }

    @Transactional
    public RepositoryPostResponse primaryRepository(Long repositoryId, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Repository repository = repositoryRepository.findByRepositoryIdAndMember_MemberId(repositoryId, member.getMemberId())
                .orElseThrow(RepositoryNotFoundException::new);

        repository.setRepositoryIsPrimary(!repository.getRepositoryIsPrimary());

        repositoryRepository.save(repository);

        return RepositoryPostResponse.from(repository);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
    }
}
