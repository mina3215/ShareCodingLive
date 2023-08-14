package com.codragon.sclive.dao;

import com.codragon.sclive.dto.UserResDto;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserDao {

    private String email;

    private String changedEmail;

    private String nickname;

    private String password;

    private String role;

    private String fcm_access_token;

    public UserResDto getUserdaoToDto() {
        UserResDto userResDto = new UserResDto();
        userResDto.setEmail(this.email);
        userResDto.setNickname(this.nickname);
        return userResDto;
    }
}
