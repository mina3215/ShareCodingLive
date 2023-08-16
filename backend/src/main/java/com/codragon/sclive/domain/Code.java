package com.codragon.sclive.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;


@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Code {

    // 수업
    @JsonIgnore
    private String course_id;

    // Code Domain Unique ID
    @JsonIgnore
    private String id;

    // Code 제목
    private String title;

    // Code 내용 + 주석 포함
    private String content;

    private String language;

    // Code 생성 시각
    @JsonIgnore
    private String created_time;

    // Code 한 줄 요약
    private String summarization;
}
