package com.example.portalio.domain.board.dto;

import com.example.portalio.domain.board.enums.BoardRole;
import jakarta.validation.constraints.NotNull;
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
    private String boardTitle;

    @NotNull(message = "empty board content")
    private String boardContent;

//    @NotNull(message = "empty member id")
//    private Long memberId;

}
