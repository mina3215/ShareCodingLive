package com.codragon.sclive.service;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.mapper.UserMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
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
        List<UserDao> userDaoList = userMapper.emailCheck(email);//같은 이메일을 가진 회원 목록 조회
        if (userDaoList.size() > 0) {//해당하는 회원이 0명 이상이면 중복된 이메일
            return false;
        } else {
            return true;
        }
    }

    @Override
    public boolean nickNameCheck(String nickname) {
        List<UserDao> userDaoList = userMapper.nickNameCheck(nickname); //같은 닉네임을 가진 회원 목록 조회
        if (userDaoList.size() > 0) { //해당하는 회원이 0명 이상이면 중복된 닉네임
            return false;
        } else {
            return true;
        }
    }

    @Override
    public void deleteUser(String email) {
        userMapper.deleteUser(email);
    }

    @Override
    public UserDao getUserInfo(String email) {
        UserDao userDao = userMapper.getUserInfo(email);
        return userDao;
    }
}
