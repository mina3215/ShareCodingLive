package com.codragon.sclive.service;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.exception.CustomJWTException;
import com.codragon.sclive.exception.JWTErrorCode;
import com.codragon.sclive.jwt.JWTUtil;
import com.codragon.sclive.jwt.Jwt;
import com.codragon.sclive.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Slf4j
public class TokenServiceImpl implements TokenService {

    private final Jwt jwt;
    private final UserMapper userMapper;
    private final JWTUtil jwtUtil;


    @Override
    public Boolean getValidation(String token) {
        return jwt.validateToken(token, null);
    }

    @Override
    public String getAccessTokenByRefreshToken(String refreshToken) {

        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new CustomJWTException(JWTErrorCode.TOKEN_IS_NULL);
        }
        jwt.validateToken(refreshToken, null);
        String userEmail = jwt.getEmailFromToken(refreshToken);

        UserDao userDao = userMapper.getUserByEmail(userEmail);

        return jwt.createAccessToken(userDao.getEmail(), userDao.getNickname());
    }
}
