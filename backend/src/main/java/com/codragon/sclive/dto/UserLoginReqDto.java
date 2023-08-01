package com.codragon.sclive.dto;

import com.codragon.sclive.dao.UserDao;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginReqDto {

    private String email;

    private String password;

    public UserDao UserDtoToDao() {
        UserDao userDao = new UserDao();
        userDao.setEmail(this.email);
        userDao.setPassword(this.password);
        return  userDao;
    }
}
