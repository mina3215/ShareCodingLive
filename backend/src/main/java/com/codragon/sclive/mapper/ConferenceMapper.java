package com.codragon.sclive.mapper;

import com.codragon.sclive.dao.ConCreateDao;
import com.codragon.sclive.dao.ConEndDao;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ConferenceMapper {

    void create(ConCreateDao conCreateDao);

    int end(ConEndDao dao);

    void update(String uuid);

    int find(String uuid);
}
