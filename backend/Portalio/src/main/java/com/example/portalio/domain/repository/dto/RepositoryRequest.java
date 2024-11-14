package com.example.portalio.domain.repository.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class RepositoryRequest {

    @NotNull(message = "empty repository title")
    @Size(max = 50, message = "long title")
    private String repositoryTitle;

    @Size(max = 200, message = "Description too long")
    private String repositoryDescription;

    @NotNull(message = "empty repository content")
    private String repositoryContent;

    @NotNull(message = "empty repository start_date")
    private LocalDate startDate;

    @NotNull(message = "empty repository end_date")
    private LocalDate endDate;

    private String repositoryFileKey;

    @NotNull(message = "empty repository post")
    private Boolean repositoryPost;
}
