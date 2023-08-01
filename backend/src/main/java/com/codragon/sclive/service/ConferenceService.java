package com.codragon.sclive.service;

import com.codragon.sclive.dao.ConCreateDao;
import com.codragon.sclive.dto.ConferenceCreateResDto;

public interface ConferenceService {
    ConferenceCreateResDto create(ConCreateDao conCreateDao);
}
