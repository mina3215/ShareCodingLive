package com.codragon.sclive.dao;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Map;

@Getter
@Setter
@ToString
public class ConJoinDao {

    private String uuid;

    private String email;

    private Map<String, Object> param;
}
