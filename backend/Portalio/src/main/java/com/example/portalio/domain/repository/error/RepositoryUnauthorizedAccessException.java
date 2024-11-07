package com.example.portalio.domain.repository.error;

public class RepositoryUnauthorizedAccessException extends RuntimeException {
    public RepositoryUnauthorizedAccessException() { super("Repository Unauthorized Access"); }
    public RepositoryUnauthorizedAccessException(String message) {
        super(message);
    }

    @Override
    public synchronized Throwable fillInStackTrace() { return this; }
}
