package com.codragon.sclive.service;

import com.codragon.sclive.dao.ConCreateDao;
import com.codragon.sclive.dao.ConEndDao;
import com.codragon.sclive.dao.ConJoinDao;
import com.codragon.sclive.dto.ConferenceCreateResDto;

public interface ConferenceService {

    ConferenceCreateResDto create(ConCreateDao conCreateDao);

    String join(ConJoinDao conJoinDao) throws Exception;

    int end(ConEndDao dao);

    void update(String uuid);

    int find(String uuid);
}
