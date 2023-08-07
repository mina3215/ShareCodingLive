package com.codragon.sclive.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class HistoryGetResDto {

    private String courseId; // 강의 UUID

    private String startTime; //강의 시작 시간

    private String title; // 강의 제목

    private String nickname; // 강사 이름

}
