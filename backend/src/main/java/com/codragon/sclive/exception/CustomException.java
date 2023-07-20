package com.codragon.sclive.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
//@AllArgsConstructor
public class CustomException extends RuntimeException {
    private JWTErrorCode jwtErrorCode;

    public CustomException(JWTErrorCode jwtErrorCode) {
        this.jwtErrorCode = jwtErrorCode;
    }

}


