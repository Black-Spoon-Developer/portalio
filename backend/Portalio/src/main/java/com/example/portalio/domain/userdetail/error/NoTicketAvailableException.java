package com.example.portalio.domain.userdetail.error;

public class NoTicketAvailableException extends RuntimeException {
    public NoTicketAvailableException() { super("No ticket available"); }
    public NoTicketAvailableException(String message) {
        super(message);
    }

    @Override
    public synchronized Throwable fillInStackTrace() { return this; }
}
