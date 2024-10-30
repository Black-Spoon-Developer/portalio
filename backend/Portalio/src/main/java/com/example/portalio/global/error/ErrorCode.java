package com.example.portalio.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    BOARD_NOT_FOUND(HttpStatus.FORBIDDEN, "Board Not Found");

    private final HttpStatus status;
    private final String message;
}
