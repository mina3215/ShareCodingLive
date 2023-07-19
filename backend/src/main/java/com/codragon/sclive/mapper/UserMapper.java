package com.codragon.sclive.mapper;

import com.codragon.sclive.dao.UserDao;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    void updatePassword(UserDao userDao);

    void updateUserInfo(UserDao userDao);
}
