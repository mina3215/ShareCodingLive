package com.codragon.sclive.service;

import com.codragon.sclive.domain.ChatMessage;

public interface MessageService {

    ChatMessage processMessage(ChatMessage message);
}
