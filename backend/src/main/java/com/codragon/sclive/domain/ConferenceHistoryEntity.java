package com.codragon.sclive.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConferenceHistoryEntity {

    private int id;

    private String userEmail;

    private String conferenceUuid;

    private String joinTime;
}
