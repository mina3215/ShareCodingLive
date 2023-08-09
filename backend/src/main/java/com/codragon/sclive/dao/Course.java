package com.codragon.sclive.dao;

import com.codragon.sclive.domain.Code;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;


@Getter
@Setter
@ToString
public class Course {

    @JsonIgnore
    private String courseUUID;

    private String title;

    private String teacher;

    private List<Code> codes;
}
