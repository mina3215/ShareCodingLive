package com.codragon.sclive.dto;

import lombok.Builder;
import lombok.Getter;


@Getter
@Builder
public class UserLoginResDto {

    private int httpStatusCode;

    private String message;

    private String nickname;
}
