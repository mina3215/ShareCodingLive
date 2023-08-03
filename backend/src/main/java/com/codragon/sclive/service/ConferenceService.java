package com.codragon.sclive.service;

import com.codragon.sclive.dao.ConCreateDao;
import com.codragon.sclive.dao.ConEndDao;
import com.codragon.sclive.dao.ConJoinDao;

public interface ConferenceService {

//    ConferenceCreateResDto create(ConCreateDao conCreateDao);
//
//    boolean start(String uuid);

    boolean start(ConCreateDao dao);

    String join(ConJoinDao conJoinDao);

    int end(ConEndDao dao);
}
