package com.codragon.sclive.mapper;

import com.codragon.sclive.dao.UserDao;
import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;
import java.util.List;

@Mapper
public interface UserMapper {
    void updatePassword(UserDao userDao);// throws SQLException; 해서 핸들러 처리

    void updateUserInfo(UserDao userDao);

    void signup(UserDao userDao);

    int emailCheck(String email);

    int nickNameCheck(String nickname);

    void deleteUser(String email);

    UserDao getUserInfo(String email);
}
