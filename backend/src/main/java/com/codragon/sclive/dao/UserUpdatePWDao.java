package com.codragon.sclive.dao;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdatePWDao {

    String email;

    String password;

    String beforePW;

    String afterPW;

}
