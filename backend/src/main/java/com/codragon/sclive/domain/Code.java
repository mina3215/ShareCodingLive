package com.codragon.sclive.domain;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class Code {

    // Code Domain Unique ID
    private int id;

    // 수업 
    private String course_id;

    // Code 제목
    private String title;

    // Code 내용 + 주석 포함
    private String content;

    // Code 생성 시각
    private String created_time;

    // Code 한 줄 요약
    private String summarization;
}
