package com.codragon.sclive.mapper;

import com.codragon.sclive.dao.UserDao;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {
    void updatePassword(UserDao userDao);

    void updateUserInfo(UserDao userDao);

    void signup(UserDao userDao);

    List<UserDao> emailCheck(String email);

    List<UserDao> nickNameCheck(String nickname);
}
