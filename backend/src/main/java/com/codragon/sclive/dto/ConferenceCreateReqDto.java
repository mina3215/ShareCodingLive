package com.codragon.sclive.dto;

import com.codragon.sclive.dao.ConCreateDao;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConferenceCreateReqDto {

    private String startTime;

    private String title;

    private String uuid;

    public ConCreateDao dtoTodao() {
        ConCreateDao dao = new ConCreateDao();
        dao.setStartTime(this.startTime);
        dao.setTitle(this.title);
        dao.setConferenceUuid(this.uuid);
        return dao;
    }
}
