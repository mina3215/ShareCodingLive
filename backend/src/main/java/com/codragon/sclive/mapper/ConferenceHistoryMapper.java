package com.codragon.sclive.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ConferenceHistoryMapper {


    void create(String userEmail, String uuid);
}
