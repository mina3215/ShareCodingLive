package com.codragon.sclive.mapper;

import com.codragon.sclive.dao.ConCreateDao;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ConferenceMapper {
    void create(ConCreateDao conCreateDao);
}
