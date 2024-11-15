package com.example.portalio.domain.jobhistory.error;

public class JobHistoryNotFoundException extends RuntimeException {
  public JobHistoryNotFoundException() { super("JobHistory not found"); }
    public JobHistoryNotFoundException(String message) {
        super(message);
    }

  @Override
  public synchronized Throwable fillInStackTrace() { return this; }
}
