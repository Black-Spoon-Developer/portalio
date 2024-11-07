package com.example.portalio.domain.repository.error;

public class RepositoryNotFoundException extends RuntimeException {
    public RepositoryNotFoundException() { super("Repository not found"); }
    public RepositoryNotFoundException(String message) {
        super(message);
    }

    @Override
    public synchronized Throwable fillInStackTrace() { return this; }
}
