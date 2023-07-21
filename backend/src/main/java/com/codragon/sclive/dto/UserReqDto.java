package com.codragon.sclive.dto;

import com.codragon.sclive.dao.UserDao;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserReqDto {

    private String email;

    private String nickname;

    private String password;

    public UserDao UserDtoToDao() {
        UserDao userDao = new UserDao();
        userDao.setEmail(email);
        userDao.setNickname(nickname);
        userDao.setPassword(password);
        return userDao;
    }

    @Override
    public String toString() {
        return "UserReqDto{" +
                "email='" + email + '\'' +
                ", nickname='" + nickname + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
