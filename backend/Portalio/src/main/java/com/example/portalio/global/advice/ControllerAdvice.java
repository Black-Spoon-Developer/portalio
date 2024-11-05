package com.example.portalio.global.advice;

import com.example.portalio.domain.activityboard.error.ActivityBoardNotFoundException;
import com.example.portalio.domain.board.error.BoardNotFoundException;
import com.example.portalio.domain.jobsubcategory.error.JobSubCategoryNotFoundException;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.portfolio.error.PortfolioNotFoundException;
import com.example.portalio.domain.repository.error.RepositoryNotFoundExcception;
import com.example.portalio.global.error.ErrorCode;
import com.example.portalio.global.error.ErrorResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class ControllerAdvice {

    @ExceptionHandler(BoardNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleBoardNotFound(BoardNotFoundException e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.BOARD_NOT_FOUND);
    }

    @ExceptionHandler(PortfolioNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handlePortfolioNotFound(PortfolioNotFoundException e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.PORTFOLIO_NOT_FOUND);
    }

    @ExceptionHandler(ActivityBoardNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleActivityBoardNotFound(ActivityBoardNotFoundException e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.ACTIVITYBOARD_NOT_FOUND);
    }

    @ExceptionHandler(JobSubCategoryNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleJobSubCategoryNotFound(JobSubCategoryNotFoundException e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.JOB_SUB_CATEGORY_NOT_FOUND);
    }

    @ExceptionHandler(RepositoryNotFoundExcception.class)
    public ResponseEntity<ErrorResponseDto> handleRepositoryNotFound(RepositoryNotFoundExcception e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.REPOSITORY_NOT_FOUND);
    }

    @ExceptionHandler(MemberNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleMemberNotFound(MemberNotFoundException e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.MEMBER_NOT_FOUND);
    }

    private ResponseEntity<ErrorResponseDto> getResponse(ErrorCode errorCode) {
        return ResponseEntity.status(errorCode.getStatus()).body(new ErrorResponseDto(errorCode));
    }
}
