package com.example.portalio.global.advice;

import com.example.portalio.domain.activityboard.error.ActivityBoardNotFoundException;
import com.example.portalio.domain.board.error.BoardNotFoundException;
import com.example.portalio.domain.board.error.BoardUnauthorizedAccessException;
import com.example.portalio.domain.boardcomment.error.BoardCommentNotFoundException;
import com.example.portalio.domain.boardrecom.error.AlreadyBoardRecomException;
import com.example.portalio.domain.jobsubcategory.error.JobSubCategoryNotFoundException;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.member.error.NotPermissionException;
import com.example.portalio.domain.portfolio.error.PortfolioNotFoundException;
import com.example.portalio.domain.portfoliocomment.error.PortfolioCommentNotFoundException;
import com.example.portalio.domain.portfoliorecom.error.AlreadyPortfolioRecomException;
import com.example.portalio.domain.repository.error.RepositoryNotFoundException;
import com.example.portalio.domain.repository.error.RepositoryUnauthorizedAccessException;
import com.example.portalio.domain.userdetail.error.NoTicketAvailableException;
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

    @ExceptionHandler(RepositoryNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleRepositoryNotFound(RepositoryNotFoundException e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.REPOSITORY_NOT_FOUND);
    }

    @ExceptionHandler(MemberNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleMemberNotFound(MemberNotFoundException e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.MEMBER_NOT_FOUND);
    }

    @ExceptionHandler(RepositoryUnauthorizedAccessException.class)
    public ResponseEntity<ErrorResponseDto> handleRepositoryUnauthorizedAccess(RepositoryUnauthorizedAccessException e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.REPOSITORY_UNAUTHORIZED_ACCESS);
    }

    @ExceptionHandler(BoardUnauthorizedAccessException.class)
    public ResponseEntity<ErrorResponseDto> handleBoardUnauthorizedAccess(BoardUnauthorizedAccessException e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.BOARD_UNAUTHORIZED_ACCESS);
    }

    @ExceptionHandler(NoTicketAvailableException.class)
    public ResponseEntity<ErrorResponseDto> handleNoTicketAvailable(NoTicketAvailableException e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.NO_TICKET_AVAILABLE);
    }

    @ExceptionHandler(AlreadyBoardRecomException.class)
    public ResponseEntity<ErrorResponseDto> handleAlreadyBoardRecom(AlreadyBoardRecomException e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.ALREADY_RECOM_BOARD);
    }

    @ExceptionHandler(AlreadyPortfolioRecomException.class)
    public ResponseEntity<ErrorResponseDto> handleAlreadyPortfolioRecom(AlreadyPortfolioRecomException e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.ALREADY_RECOM_PORTFOLIO);
    }

    @ExceptionHandler(BoardCommentNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleBoardCommentNotFound(BoardCommentNotFoundException e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.BOARD_COMMENT_NOT_FOUND);
    }

    @ExceptionHandler(PortfolioCommentNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handlePortfolioCommentNotFound(PortfolioCommentNotFoundException e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.PORTFOLIO_COMMENT_NOT_FOUND);
    }

    @ExceptionHandler(NotPermissionException.class)
    public ResponseEntity<ErrorResponseDto> handlePortfolioCommentNotFound(NotPermissionException e) {
        log.info(e.getMessage());
        return getResponse(ErrorCode.NOT_PERMISSION);
    }
    private ResponseEntity<ErrorResponseDto> getResponse(ErrorCode errorCode) {
        return ResponseEntity.status(errorCode.getStatus()).body(new ErrorResponseDto(errorCode));
    }
}
