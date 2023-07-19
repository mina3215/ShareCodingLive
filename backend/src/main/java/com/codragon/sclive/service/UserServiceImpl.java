package com.codragon.sclive.service;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.mapper.UserMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService{
    private final UserMapper userMapper;
    public UserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public void updatePassword(UserDao userDao) {
        String encodedPW = "asdfasdf";
        userDao.setPassword(encodedPW);
        userMapper.updatePassword(userDao);
    }

    @Override
    public void updateUserInfo(UserDao userDao) {
        userMapper.updateUserInfo(userDao);
    }

    @Override
    public void signup(UserDao userDao) {
        userMapper.signup(userDao);
    }

    @Override
    public boolean emailCheck(String email) {
        List<UserDao> userDaoList = userMapper.emailCheck(email);
        if(userDaoList.size()>0){
            return false;
        } else{
            return true;
        }
    }
}
