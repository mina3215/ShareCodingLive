package com.codragon.sclive.dao;

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
}
