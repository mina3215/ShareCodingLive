package com.codragon.sclive.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ConferenceJoinReqDto {

    private String uuid;

    private boolean isOwner;

}
