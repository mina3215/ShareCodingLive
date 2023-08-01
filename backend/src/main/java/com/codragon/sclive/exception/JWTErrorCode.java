package com.codragon.sclive.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
@AllArgsConstructor
public enum JWTErrorCode {
    // jwt에서 사용
    EXPIRED_TOKEN(NOT_ACCEPTABLE, "유효 기간이 지난 토큰입니다"),
    NOT_VALID_TOKEN(UNAUTHORIZED, "잘못 만들어진 토큰입니다! (해킹 위험)"),

    // 토큰 서비스에서 사용
    TOKEN_IS_NULL(BAD_REQUEST, "refresh 토큰이 존재하지 않습니다");

    private final HttpStatus httpStatus;
    private final String message;
}
