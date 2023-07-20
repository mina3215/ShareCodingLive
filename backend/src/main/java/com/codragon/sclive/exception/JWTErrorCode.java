package com.codragon.sclive.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
@AllArgsConstructor
public enum JWTErrorCode {
    EXPIRED_TOKEN(NOT_ACCEPTABLE, "만료된 토큰입니다."),
    NOT_VALID_TOKEN(UNAUTHORIZED, "유효하지 않은 토큰입니다!!!!");

    private final HttpStatus httpStatus;
    private final String message;
}
