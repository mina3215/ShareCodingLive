package com.codragon.sclive.dao;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class FCMNoticeReqDao {

    private LocalDateTime reservationTime;

    private String targetEmail;

    private String token;

    @Builder
    public FCMNoticeReqDao(LocalDateTime reservationTime, String targetEmail, String title, String body) {
        this.reservationTime = reservationTime;
        this.targetEmail = targetEmail;
    }
}
