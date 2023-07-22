package com.codragon.sclive.service;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.jwt.Jwt;
import com.codragon.sclive.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService{
    private final Jwt jwt;
    private final UserMapper userMapper;


    @Override
    public Boolean getValidation(String token) {
        return jwt.validateToken(token);
    }

    @Override
    public String getAccessTokenByRefreshToken(String refreshToken) {
        // TODO: redis에서 유저 정보 가져오기
        String userEmail;
        UserDao userDao = userMapper.getUserInfo(userEmail);
        return jwt.createAccessToken(userDao.getEmail(), userDao.getNickname());
    }
}
