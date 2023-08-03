package com.codragon.sclive.service;

import com.codragon.sclive.dao.ConCreateDao;
import com.codragon.sclive.dao.ConEndDao;
import com.codragon.sclive.dao.ConJoinDao;
import com.codragon.sclive.dao.HistoryCreateDao;
import com.codragon.sclive.mapper.ConferenceHistoryMapper;
import com.codragon.sclive.mapper.ConferenceMapper;
import com.codragon.sclive.openvidu.OpenviduUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ConferenceServiceImpl implements ConferenceService {

    private final ConferenceMapper conferenceMapper;
    private final ConferenceHistoryMapper historyMapper;
    private final OpenviduUtil openviduUtil;

//    @Override
//    public ConferenceCreateResDto create(ConCreateDao conCreateDao) {
////        String uuid = UUID.randomUUID().toString();
////        conCreateDao.setConferenceUuid(uuid);
////        if (conCreateDao.getStartTime() == null) { //시작시간을 설정하지 않은 경우 현재 시각으로
////            conCreateDao.setStartTime(new Date().toString());
////        }
////        //conferenceMapper.create(conCreateDao);
////
//        ConferenceCreateResDto conferenceCreateResDto = new ConferenceCreateResDto();
////        conferenceCreateResDto.setUuid(uuid);
////        String link = "https://localhost:3000/" + uuid; // Todo : 적절한 프론트 주소로 변경
////        conferenceCreateResDto.setLink(link);
//        return conferenceCreateResDto;
//    }

    @Override
    public boolean start(ConCreateDao dao) {
        boolean flag = true;
        try {
            Map<String, Object> param = new HashMap<>();
            param.put("customSessionId", dao.getConferenceUuid());
            openviduUtil.initializeSession(param);
            conferenceMapper.create(dao);
        } catch (Exception e) {
            e.printStackTrace();
            flag = false;
        }
        return flag;
    }

    @Override
    public String join(ConJoinDao conJoinDao) {
        // con_history 생성
        HistoryCreateDao dao = new HistoryCreateDao();
        dao.setEmail(conJoinDao.getEmail());
        dao.setUuid(conJoinDao.getUuid());
        // 참가 할때마다 기록
        historyMapper.create(dao);

        // openvidu createConnection
        String token = null;
        try {
            Map<String, Object> params = new HashMap<>();
            token = openviduUtil.createConnection(conJoinDao.getUuid(), params);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return token;
    }

    @Override
    public int end(ConEndDao dao) {
        return conferenceMapper.end(dao);
    }
}
