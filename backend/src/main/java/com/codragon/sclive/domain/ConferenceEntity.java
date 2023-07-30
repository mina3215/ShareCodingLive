package com.codragon.sclive.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConferenceEntity {

    private String conferenceUuid;

    private String startTime;

    private String endTime;

    private String title;

    private int isActive;

    private String ownerEmail;

}
