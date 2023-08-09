package com.codragon.sclive.mapper;

import com.codragon.sclive.dao.HistoryCreateDao;
import com.codragon.sclive.dao.UserHistoryCourse;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ConferenceHistoryMapper {

    void create(HistoryCreateDao dao);

    List<UserHistoryCourse> getUserConferenceHistory(String userEmail);
}
