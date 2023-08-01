package com.codragon.sclive.mapper;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.dao.UserUpdatePWDao;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {

    void updatePassword(UserUpdatePWDao userDao);

    void updateUserInfo(UserDao userDao);

    void signup(UserDao userDao);

    int emailCheck(String email);

    int nickNameCheck(String nickname);

    void deleteUser(String email);

    UserDao getUserByEmail(String email);
}
