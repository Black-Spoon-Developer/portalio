package com.example.portalio.domain.repository.dto;

import com.example.portalio.domain.repository.entity.Repository;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RepositoryResponse {
    private Long repositoryId;
    private String repositoryTitle;
    private String repositoryContent;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    private String repositoryFileKey;
    private Boolean repositoryPost;
    private Boolean repositoryIsPrimary;
    private Long memberId;

    public static RepositoryResponse from(Repository repository) {
        return RepositoryResponse.builder()
                .repositoryId(repository.getRepositoryId())
                .repositoryTitle(repository.getRepositoryTitle())
                .repositoryContent(repository.getRepositoryContent())
                .startDate(repository.getStartDate())
                .endDate(repository.getEndDate())
                .repositoryFileKey(repository.getRepositoryFileKey())
                .repositoryPost(repository.getRepositoryPost())
                .repositoryIsPrimary(repository.getRepositoryIsPrimary())
                .memberId(repository.getMember().getMemberId())
                .build();
    }
}
