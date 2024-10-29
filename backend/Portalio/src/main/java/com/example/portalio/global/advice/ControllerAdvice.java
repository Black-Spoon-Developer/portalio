package com.example.portalio.global.advice;

import com.example.portalio.domain.board.error.BoardNotFoundException;
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

    private ResponseEntity<ErrorResponseDto> getResponse(ErrorCode errorCode) {
        return ResponseEntity.status(errorCode.getStatus()).body(new ErrorResponseDto(errorCode));
    }
}
