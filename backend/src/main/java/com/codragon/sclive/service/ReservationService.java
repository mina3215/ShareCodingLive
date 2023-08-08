package com.codragon.sclive.service;

import com.codragon.sclive.dao.ReservationCreateDao;
import com.codragon.sclive.dto.ReservationListResDto;

public interface ReservationService {
    void create(ReservationCreateDao reservationCreateDao);

    ReservationListResDto list(String userEmail);
}
