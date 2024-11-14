package com.example.portalio.domain.board.dto;

import com.example.portalio.domain.board.enums.BoardRole;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class BoardRequest {

    @NotNull(message = "select category")
    private BoardRole boardCategory;

    @NotNull(message = "empty board title")
    @Size(max = 50, message = "long title")
    private String boardTitle;

    @NotNull(message = "empty board content")
    private String boardContent;

    private String boardThumbnailImg;
}
