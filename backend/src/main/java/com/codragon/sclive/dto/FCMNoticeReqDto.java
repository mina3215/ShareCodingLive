package com.codragon.sclive.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FCMNoticeReqDto {

    private Long targetUserId;

    private String title;

    private String body;

    @Builder
    public FCMNoticeReqDto(Long targetUserId, String title, String body){
        this.targetUserId = targetUserId;
        this.title = title;
        this.body = body;
    }
}
