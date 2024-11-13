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
    JOB_SUB_CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "JobSubCategory Not Found"),
    MEMBER_NOT_FOUND(HttpStatus.FORBIDDEN, "Member Not Found"),
    REPOSITORY_UNAUTHORIZED_ACCESS(HttpStatus.FORBIDDEN, "Repository Unauthorized Access"),
    BOARD_UNAUTHORIZED_ACCESS(HttpStatus.FORBIDDEN, "Board Unauthorized Access"),
    NO_TICKET_AVAILABLE(HttpStatus.BAD_REQUEST, "No Ticket Available"),
    ALREADY_RECOM_BOARD(HttpStatus.CONFLICT, "Already recom board"),
    ALREADY_RECOM_PORTFOLIO(HttpStatus.CONFLICT, "Already recom portfolio"),
    BOARD_COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "Board Comment Not Found"),
    PORTFOLIO_COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "Portfolio Comment Not Found"),
    NOT_PERMISSION(HttpStatus.FORBIDDEN, "Not Permission");

    private final HttpStatus status;
    private final String message;
}
