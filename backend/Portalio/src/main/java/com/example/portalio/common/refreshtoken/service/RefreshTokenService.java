package com.example.portalio.common.refreshtoken.service;

import com.example.portalio.common.refreshtoken.RefreshToken;
import com.example.portalio.common.refreshtoken.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public void saveTokenInfo(String email, String refreshToken, String accessToken) {
        refreshTokenRepository.save(new RefreshToken(email, accessToken, refreshToken));
    }

    @Transactional
    public void removeRefreshToken(String accessToken) {
        RefreshToken token = refreshTokenRepository.findByAccessToken(accessToken)
                .orElseThrow(IllegalAccessError::new);

        refreshTokenRepository.delete(token);
    }

}
