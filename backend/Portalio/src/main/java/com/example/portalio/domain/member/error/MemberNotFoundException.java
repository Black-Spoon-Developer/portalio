package com.example.portalio.domain.member.error;

public class MemberNotFoundException extends RuntimeException {
    public MemberNotFoundException() { super("Member not found"); }
    public MemberNotFoundException(String message) {
        super(message);
    }

    @Override
    public synchronized Throwable fillInStackTrace() { return this; }
}
