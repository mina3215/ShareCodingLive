package com.codragon.sclive.service;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.dto.UserReqDto;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpServletResponse;

public interface UserService {
    void updatePassword(UserDao userDao);

    void updateUserInfo(UserDao userDao);

    void signup(UserDao userDao);

    int emailCheck(String email);

    int nickNameCheck(String nickname);

    void deleteUser(String accesstoken);

    UserDao getUserInfo(String email);

    ResponseEntity login(UserReqDto userReqDto, HttpServletResponse response);
}
