package com.example.portalio.domain.member.error;

public class NotPermissionException extends RuntimeException {
    public NotPermissionException() { super( "Not Permission Exception" ); }
    public NotPermissionException(String message) {
        super(message);
    }

    @Override
    public synchronized Throwable fillInStackTrace() { return this; }
}
