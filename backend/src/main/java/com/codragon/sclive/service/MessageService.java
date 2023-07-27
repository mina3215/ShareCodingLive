package com.codragon.sclive.service;

import com.codragon.sclive.domain.ChatMessage;

public interface MessageService {

//    public ChatRoom createRoom(String roomId);

    void saveCode(String roomId);

    ChatMessage sendMessage(ChatMessage message);

}
