package com.codragon.sclive.service;

import com.codragon.sclive.dao.ReservationCreateDao;
import com.codragon.sclive.dto.ReservationListResDto;
import com.codragon.sclive.mapper.ReservationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationMapper reservationMapper;

    @Override
    public void create(ReservationCreateDao reservationCreateDao) {
        String uuid = UUID.randomUUID().toString();
        reservationCreateDao.setUuid(uuid);
        reservationMapper.create(reservationCreateDao);
    }

    @Override
    public List<ReservationListResDto> list(String userEmail) {
        List<ReservationListResDto> dtos = reservationMapper.list(userEmail);
        return dtos;
    }

    @Override
    public int update(ReservationCreateDao reservationCreateDao) {
        int res = reservationMapper.update(reservationCreateDao);
        return res;
    }

    @Override
    public int delete(String uuid) {
        return reservationMapper.delete(uuid);
    }

    @Override
    public void save(String userEmail, String fcm_access_token) {
        reservationMapper.save(userEmail, fcm_access_token);
    }
}
