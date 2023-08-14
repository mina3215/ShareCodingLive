package com.codragon.sclive.dto;

import com.codragon.sclive.dao.ReservationCreateDao;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationCreateReqDto {

    private String title;

    private String reservationTime;

    public ReservationCreateDao reqToDto() {
        ReservationCreateDao dao = new ReservationCreateDao();
        dao.setTitle(title);
        dao.setReservationTime(reservationTime);
        return dao;
    }
}
