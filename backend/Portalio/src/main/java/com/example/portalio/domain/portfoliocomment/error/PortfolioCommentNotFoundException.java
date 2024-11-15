package com.example.portalio.domain.portfoliocomment.error;

public class PortfolioCommentNotFoundException extends RuntimeException {
    public PortfolioCommentNotFoundException() { super("Portfolio comment not found"); }
    public PortfolioCommentNotFoundException(String message) {
        super(message);
    }

    @Override
    public synchronized Throwable fillInStackTrace() { return this; }
}
