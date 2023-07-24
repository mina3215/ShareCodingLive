package com.codragon.sclive.dao;

import com.codragon.sclive.dto.UserResDto;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserDao {

    String email;

    String changedEmail;

    String nickname;

    String password;

    public UserResDto getUserdaoToDto() {
        UserResDto userResDto = new UserResDto();
        userResDto.setEmail(this.email);
        userResDto.setNickname(this.nickname);
        return userResDto;
    }
}
