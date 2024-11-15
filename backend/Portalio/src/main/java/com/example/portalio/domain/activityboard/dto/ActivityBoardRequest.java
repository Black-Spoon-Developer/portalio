package com.example.portalio.domain.activityboard.dto;

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
public class ActivityBoardRequest {

    @NotNull(message = "empty activity board title")
    @Size(max = 50, message = "long title")
    private String activityBoardTitle;

    @NotNull(message = "empty activity board content")
    private String activityBoardContent;

    @NotNull(message = "empty activity board date")
    private LocalDate activityBoardDate = LocalDate.now();

    @NotNull(message = "empty repository id")
    private Long repositoryId;
}
