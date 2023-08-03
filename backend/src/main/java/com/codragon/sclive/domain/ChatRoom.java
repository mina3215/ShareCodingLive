package com.codragon.sclive.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ChatRoom {

    private String roomId;

    public static ChatRoom create(String roomId) {
        ChatRoom room = new ChatRoom();
        room.roomId = roomId;
        return room;
    }
}
