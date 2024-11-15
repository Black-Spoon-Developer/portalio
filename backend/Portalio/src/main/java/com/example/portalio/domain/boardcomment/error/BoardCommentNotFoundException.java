package com.example.portalio.domain.boardcomment.error;

public class BoardCommentNotFoundException extends RuntimeException {
    public BoardCommentNotFoundException() { super("Board comment not found"); }
    public BoardCommentNotFoundException(String message) {
        super(message);
    }

    @Override
    public synchronized Throwable fillInStackTrace() { return this; }
}
