package com.codragon.sclive.service;

import com.codragon.sclive.dao.ConCreateDao;
import com.codragon.sclive.dao.ConEndDao;
import com.codragon.sclive.dao.ConJoinDao;
import com.codragon.sclive.dao.HistoryCreateDao;
import com.codragon.sclive.dto.ConferenceCreateResDto;
import com.codragon.sclive.mapper.ConferenceHistoryMapper;
import com.codragon.sclive.mapper.ConferenceMapper;
import com.codragon.sclive.openvidu.OpenviduUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
        conferenceMapper.create(conCreateDao);

        ConferenceCreateResDto conferenceCreateResDto = new ConferenceCreateResDto();
        conferenceCreateResDto.setUuid(uuid);
        String link = "https://www.sclive.link/meeting/" + uuid;
        conferenceCreateResDto.setLink(link);
        return conferenceCreateResDto;
    }

    @Override
    public void update(String uuid) {
        conferenceMapper.update(uuid);
    }

    @Override
    public int find(String uuid) {
        int res = conferenceMapper.find(uuid);
        return res;
    }

    @Override
    public String join(ConJoinDao dao) throws Exception {
        String token = "";
        Map<String, Object> param = new HashMap<>();
        param.put("customSessionId", dao.getUuid());
        openviduUtil.initializeSession(param);
        token = openviduUtil.createConnection(dao.getUuid(), param);

        // con_history 생성 // 참가 할때마다 기록
        HistoryCreateDao his = new HistoryCreateDao();
        his.setEmail(dao.getEmail());
        his.setUuid(dao.getUuid());

        historyMapper.create(his);

        return token;
    }

    @Override
    public int end(ConEndDao dao) {
        return conferenceMapper.end(dao);
    }


}
