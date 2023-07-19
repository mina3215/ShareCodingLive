package com.codragon.sclive.service;

import com.codragon.sclive.dao.UserDao;

public interface UserService {
    void updatePassword(UserDao userDao);

    void updateUserInfo(UserDao userDao);

    void signup(UserDao userDao);

    boolean emailCheck(String email);

    boolean nickNameCheck(String nickname);
}
