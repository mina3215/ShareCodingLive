package com.codragon.sclive.service;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.dao.UserHistoryCourse;
import com.codragon.sclive.dao.UserUpdatePWDao;
import com.codragon.sclive.dto.TokenDto;

import java.util.List;

public interface UserService {
    int updatePassword(UserUpdatePWDao userDao);

    void updateUserInfo(UserDao userDao);

    void signup(UserDao userDao);

    int emailCheck(String email);

    int nickNameCheck(String nickname);

    void deleteUser(String accesstoken);

    UserDao getUserInfoByEmail(String email);

    TokenDto login(UserDao userDao);

    List<UserHistoryCourse> getCodeHistoryFromCourses(String userEmail);
}
