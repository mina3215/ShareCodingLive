package com.codragon.sclive.dto;

import com.codragon.sclive.dao.FCMNoticeReqDao;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class FCMNoticeReqDto {

    private LocalDateTime reservationTime;

    @Builder
    public FCMNoticeReqDto(LocalDateTime reservationTime) {
        this.reservationTime = reservationTime;
    }

    public FCMNoticeReqDao dtoToDao() {
        FCMNoticeReqDao dao = new FCMNoticeReqDao();
        dao.setReservationTime(this.reservationTime);
        dao.setReservationTime(this.reservationTime);
        return dao;
    }
}
