package com.example.portalio.s3.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ImageUploadResponse {
    private String url;

    public static ImageUploadResponse from(String url) {
        return ImageUploadResponse.builder()
                .url(url)
                .build();
    }
}