package com.example.portalio.common.oauth.dto;

import java.util.Map;

public class GoogleResponse implements OAuth2Response{

    private final Map<String, Object> attribute;

    public GoogleResponse(Map<String, Object> attribute) {
        this.attribute = attribute;
    }

    @Override
    public String getProvider() {
        return "google";
    }

    @Override
    public String getProviderId() {
        return attribute.get("sub").toString();
    }

    @Override
    public String getEmail() {
        return attribute.get("email").toString();
    }

    @Override
    public String getName() {
        return attribute.get("name").toString();
    }

    @Override
    public String getPicture() {
        Object picture = attribute.get("picture");
        return picture != null ? picture.toString() : "default_picture_url"; // 기본 이미지 URL을 설정하거나 null 처리
    }
}
