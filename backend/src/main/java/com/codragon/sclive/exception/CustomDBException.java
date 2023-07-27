package com.codragon.sclive.exception;

import lombok.Getter;

@Getter
//@AllArgsConstructor
public class CustomDBException extends RuntimeException {
    private final DBErrorCode dbErrorCode;

    public CustomDBException(DBErrorCode dbErrorCode) {
        this.dbErrorCode = dbErrorCode;
    }
}


