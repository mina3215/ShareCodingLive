package com.codragon.sclive.dto;

import com.codragon.sclive.dao.UserDao;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResDto {
    private String email;
    private String nickname;
    private String password;
}
