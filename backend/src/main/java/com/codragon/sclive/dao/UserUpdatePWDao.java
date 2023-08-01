package com.codragon.sclive.dao;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserUpdatePWDao {

    String email;

    String password;

    String beforePW;

    String afterPW;

}
