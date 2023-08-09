package com.codragon.sclive.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class TokenDto {

    private boolean isLoginSuccessful;

    private String ACCESS_TOKEN;

    private String REFRESH_TOKEN;

    private String nickname;
}
