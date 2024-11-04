package com.example.portalio.domain.repository.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositoryRepository extends JpaRepository<com.example.portalio.domain.repository.entity.Repository, Long> {

    Optional<com.example.portalio.domain.repository.entity.Repository> findByRepositoryId(Long repositoryId);

//    List<com.example.portalio.domain.repository.entity.Repository> findAllByMemberId(Long memberId);
}
