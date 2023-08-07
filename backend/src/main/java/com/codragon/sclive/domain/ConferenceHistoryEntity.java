package com.codragon.sclive.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConferenceHistoryEntity {

    private int id; // 강의 기록 인덱스

    private String userEmail; // 참여자 이메일

    private String courseId; // 강의 UUID

    private String joinTime; // 강의 참여 시간
}
