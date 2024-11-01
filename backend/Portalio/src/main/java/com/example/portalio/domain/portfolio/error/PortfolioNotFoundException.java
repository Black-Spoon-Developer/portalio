package com.example.portalio.domain.portfolio.error;

public class PortfolioNotFoundException extends RuntimeException {
    public PortfolioNotFoundException() { super("Portfolio not found"); }
    public PortfolioNotFoundException(String message) {
        super(message);
    }

    @Override
    public synchronized Throwable fillInStackTrace() { return this; }
}
