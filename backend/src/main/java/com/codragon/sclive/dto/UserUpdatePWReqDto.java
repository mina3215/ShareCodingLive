package com.codragon.sclive.dto;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.dao.UserUpdatePWDao;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdatePWReqDto {

    String beforePW;

    String afterPW;

    String email;

    public UserUpdatePWDao UserDtoToDao() {
        UserUpdatePWDao dao = new UserUpdatePWDao();
        dao.setBeforePW(this.beforePW);
        dao.setAfterPW(this.afterPW);
        return dao;
    }
}
