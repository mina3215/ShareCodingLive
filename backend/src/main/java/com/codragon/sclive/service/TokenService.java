package com.codragon.sclive.service;

public interface TokenService {
    Boolean getValidation(String token);

    String getAccessTokenByRefreshToken(String refreshToken);
}
