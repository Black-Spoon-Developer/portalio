package com.example.portalio.domain.jobsubcategory.error;

public class JobSubCategoryNotFoundException extends RuntimeException {
    public JobSubCategoryNotFoundException() { super("JobSubCategory not found"); }
    public JobSubCategoryNotFoundException(String message) {
        super(message);
    }

    @Override
    public synchronized Throwable fillInStackTrace() { return this; }
}
