package com.codragon.sclive.service;

import com.codragon.sclive.dao.ConCreateDao;
import com.codragon.sclive.dto.ConferenceCreateResDto;
import com.codragon.sclive.mapper.ConferenceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConferenceServiceImpl implements ConferenceService{

    private final ConferenceMapper conferenceMapper;

    @Override
    public ConferenceCreateResDto create(ConCreateDao conCreateDao) {
        String uuid = UUID.randomUUID().toString();

        if(conCreateDao.getStartTime()==null){ //시작시간을 설정하지 않은 경우 현재 시각으로
            conCreateDao.setStartTime(new Date().toString());
        }
        conferenceMapper.create(conCreateDao);

        ConferenceCreateResDto conferenceCreateResDto = new ConferenceCreateResDto();
        conferenceCreateResDto.setUuid(uuid);
        String link = "https://i9d109.p.ssafy.io/"+uuid; // Todo : 적절한 프론트 주소로 변경
        conferenceCreateResDto.setLink(link);
        return conferenceCreateResDto;
    }
}
