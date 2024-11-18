package com.example.portalio.domain.board.error;

public class BoardNotFoundException extends RuntimeException {
  public BoardNotFoundException() {
    super("Board not found");
  }
  public BoardNotFoundException(String message) {
      super(message);
  }

  @Override
  public synchronized Throwable fillInStackTrace() {
    return this;
  }
}
