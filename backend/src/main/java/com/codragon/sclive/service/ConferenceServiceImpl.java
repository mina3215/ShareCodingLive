package com.codragon.sclive.service;

import com.codragon.sclive.dao.ConCreateDao;
import com.codragon.sclive.dto.ConferenceCreateResDto;
import com.codragon.sclive.mapper.ConferenceHistoryMapper;
import com.codragon.sclive.mapper.ConferenceMapper;
import com.codragon.sclive.openvidu.OpenviduUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConferenceServiceImpl implements ConferenceService {

    private final ConferenceMapper conferenceMapper;
    private final ConferenceHistoryMapper historyMapper;
    private final OpenviduUtil openviduUtil;

    @Override
    public ConferenceCreateResDto create(ConCreateDao conCreateDao) {
        String uuid = UUID.randomUUID().toString();
        conCreateDao.setConferenceUuid(uuid);
        if (conCreateDao.getStartTime() == null) { //시작시간을 설정하지 않은 경우 현재 시각으로
            conCreateDao.setStartTime(new Date().toString());
        }
        conferenceMapper.create(conCreateDao);

        ConferenceCreateResDto conferenceCreateResDto = new ConferenceCreateResDto();
        conferenceCreateResDto.setUuid(uuid);
        String link = "https://i9d109.p.ssafy.io/" + uuid; // Todo : 적절한 프론트 주소로 변경
        conferenceCreateResDto.setLink(link);
        return conferenceCreateResDto;
    }

    @Override
    public void start(String uuid) {
        conferenceMapper.start(uuid);
        Map<String, Object> param = new HashMap<>();
        try {
            openviduUtil.initializeSession(param);
            // Todo : 파람에 뭐가 들어가는지?
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public String join(String userEmail, String uuid) {
        //con_history 생성
        historyMapper.create(userEmail, uuid);
        //openvidu join
        Map<String, Object> param = new HashMap<>();
        // Todo : 파람에 뭐가 들어가는지? sessionid?
        String token = null;
        try {
            token = openviduUtil.createConnection("sessionId", param);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return token;
    }
}
