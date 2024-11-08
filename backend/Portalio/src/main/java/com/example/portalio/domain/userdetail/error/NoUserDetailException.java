package com.example.portalio.domain.userdetail.error;

public class NoUserDetailException extends RuntimeException {
    public NoUserDetailException() {
        super("No UserDetail available");
    }
    public NoUserDetailException(String message) {
        super(message);
    }
}
