package com.example.portalio.domain.boardrecom.error;

public class AlreadyBoardRecomException extends RuntimeException {
    public AlreadyBoardRecomException() { super("Already Board Recom"); }
    public AlreadyBoardRecomException(String message) {
        super(message);
    }

    @Override
    public synchronized Throwable fillInStackTrace() { return this; }
}
