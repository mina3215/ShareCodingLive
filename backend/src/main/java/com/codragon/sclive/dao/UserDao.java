package com.codragon.sclive.dao;

import com.codragon.sclive.dto.UserResDto;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
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
