package com.codragon.sclive.service;

import com.codragon.sclive.dao.ReservationCreateDao;
import com.codragon.sclive.dto.ReservationListResDto;

import java.util.List;

public interface ReservationService {

    void create(ReservationCreateDao reservationCreateDao);

    List<ReservationListResDto> list(String userEmail);

    int update(ReservationCreateDao reservationCreateDao);

    int delete(String uuid);

    void save(String userEmail, String fcm_access_token);
}
