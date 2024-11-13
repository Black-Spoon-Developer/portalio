package com.example.portalio.domain.repository.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositoryRepository extends JpaRepository<com.example.portalio.domain.repository.entity.Repository, Long> {

    Optional<com.example.portalio.domain.repository.entity.Repository> findByRepositoryIdAndMember_MemberId(Long repositoryId, Long memberId);

    List<com.example.portalio.domain.repository.entity.Repository> findAllByMember_MemberUsername(String memberUsername);

    List<com.example.portalio.domain.repository.entity.Repository> findAllByRepositoryPostTrueOrderByCreatedDesc(Pageable pageable);
}
