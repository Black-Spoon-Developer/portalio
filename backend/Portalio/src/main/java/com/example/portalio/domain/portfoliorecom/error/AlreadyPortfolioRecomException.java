package com.example.portalio.domain.portfoliorecom.error;

public class AlreadyPortfolioRecomException extends RuntimeException {
    public AlreadyPortfolioRecomException() { super("Already Portfolio Recom"); }
    public AlreadyPortfolioRecomException(String message) {
        super(message);
    }

    @Override
    public synchronized Throwable fillInStackTrace() { return this; }
}
