package com.codragon.sclive.mapper;

import com.codragon.sclive.dao.ReservationCreateDao;
import com.codragon.sclive.dto.ReservationListResDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ReservationMapper {

    void create(ReservationCreateDao reservationCreateDao);

    List<ReservationListResDto> list(String userEmail);

    int delete(String uuid);
}
