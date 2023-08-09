package com.codragon.sclive.dao;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;


@Getter
@Setter
@ToString
public class UserHistoryCourse {

    private String dateOfCourse;

    private List<Course> courses;
}
