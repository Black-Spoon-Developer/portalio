package com.example.portalio.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    BOARD_NOT_FOUND(HttpStatus.NOT_FOUND, "Board Not Found"),
    PORTFOLIO_NOT_FOUND(HttpStatus.NOT_FOUND, "Portfolio Not Found"),
    ACTIVITYBOARD_NOT_FOUND(HttpStatus.NOT_FOUND, "ActivityBoard Not Found"),
    REPOSITORY_NOT_FOUND(HttpStatus.NOT_FOUND, "Repository Not Found"),
    MEMBER_NOT_FOUND(HttpStatus.FORBIDDEN, "Member Not Found");

    private final HttpStatus status;
    private final String message;
}
