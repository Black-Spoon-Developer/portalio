package com.example.portalio.domain.activityboard.error;

public class ActivityBoardNotFoundException extends RuntimeException {
    public ActivityBoardNotFoundException() { super("Activity Board Not Found"); }
    public ActivityBoardNotFoundException(String message) {
        super(message);
    }

    @Override
    public synchronized Throwable fillInStackTrace() { return this; }
}
