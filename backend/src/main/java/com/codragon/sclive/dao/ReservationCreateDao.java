package com.codragon.sclive.dao;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationCreateDao {

    private String uuid;

    private String ownerEmail;

    private String title;

    private String reservationTime;
}
