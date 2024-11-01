package com.example.portalio.domain.repository.error;

public class RepositoryNotFoundExcception extends RuntimeException {
    public RepositoryNotFoundExcception() { super("Repository not found"); }
    public RepositoryNotFoundExcception(String message) {
        super(message);
    }

    @Override
    public synchronized Throwable fillInStackTrace() { return this; }
}
