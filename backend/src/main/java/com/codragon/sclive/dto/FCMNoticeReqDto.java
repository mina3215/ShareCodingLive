package com.codragon.sclive.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class FCMNoticeReqDto {

    private LocalDateTime reservationTime;

    private Long targetUserId;

    private String title;

    private String body;

    @Builder
    public FCMNoticeReqDto(LocalDateTime reservationTime, Long targetUserId, String title, String body) {
        this.reservationTime = reservationTime;
        this.targetUserId = targetUserId;
        this.title = title;
        this.body = body;
    }
}
