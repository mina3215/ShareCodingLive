package com.codragon.sclive.exception;

import lombok.Getter;
import lombok.ToString;


@ToString
@Getter
//@AllArgsConstructor
public class CustomJWTException extends RuntimeException {
    private final JWTErrorCode jwtErrorCode;


    public CustomJWTException(JWTErrorCode jwtErrorCode) {
        this.jwtErrorCode = jwtErrorCode;
    }
}


