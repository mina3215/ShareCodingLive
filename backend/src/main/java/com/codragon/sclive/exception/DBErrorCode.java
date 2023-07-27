package com.codragon.sclive.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
@AllArgsConstructor
public enum DBErrorCode {
    ALREADY_DELETED(NOT_FOUND, "이미 탈퇴된 회원입니다");

    private final HttpStatus httpStatus;
    private final String message;
}
