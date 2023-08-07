package com.codragon.sclive.mapper;

import com.codragon.sclive.dao.HistoryCreateDao;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ConferenceHistoryMapper {

    void create(HistoryCreateDao dao);
}
