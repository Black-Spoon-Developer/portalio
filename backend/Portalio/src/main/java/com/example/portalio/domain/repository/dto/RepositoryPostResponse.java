package com.example.portalio.domain.repository.dto;

import com.example.portalio.domain.repository.entity.Repository;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RepositoryPostResponse {
    private Long repositoryId;
    private Long memberId;
    private Boolean repositoryPost;
    private Boolean repositoryIsPrimary;

    public static RepositoryPostResponse from(Repository repository) {
        return RepositoryPostResponse.builder()
                .repositoryId(repository.getRepositoryId())
                .memberId(repository.getMember().getMemberId())
                .repositoryPost(repository.getRepositoryPost())
                .repositoryIsPrimary(repository.getRepositoryIsPrimary())
                .build();
    }
}