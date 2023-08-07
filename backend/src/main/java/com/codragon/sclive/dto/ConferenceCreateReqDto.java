package com.codragon.sclive.dto;

import com.codragon.sclive.dao.ConCreateDao;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConferenceCreateReqDto {

    private String title;

    private String uuid;

    public ConCreateDao dtoToDao() {
        ConCreateDao dao = new ConCreateDao();
        dao.setTitle(this.title);
        dao.setConferenceUuid(this.uuid);
        return dao;
    }
}
