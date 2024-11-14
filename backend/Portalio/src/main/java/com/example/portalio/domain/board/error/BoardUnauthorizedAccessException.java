package com.example.portalio.domain.board.error;

public class BoardUnauthorizedAccessException extends RuntimeException {
    public BoardUnauthorizedAccessException() { super("Board unauthorized access"); }
    public BoardUnauthorizedAccessException(String message) {
        super(message);
    }

    @Override
    public synchronized Throwable fillInStackTrace() { return this; }
}
