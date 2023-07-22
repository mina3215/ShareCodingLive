package com.codragon.sclive.service;

import com.codragon.sclive.jwt.Jwt;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService{
    private final Jwt jwt;


    @Override
    public Boolean getValidation(String token) {
        return jwt.validateToken(token);
    }
}
