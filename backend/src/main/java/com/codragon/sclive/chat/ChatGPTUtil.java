package com.codragon.sclive.chat;


import io.github.flashvayne.chatgpt.service.ChatgptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;


@Slf4j
@Component
@RequiredArgsConstructor
public class ChatGPTUtil {

    // TODO: endpoint, api-key 주입 받기
    private static final String API_KEY = "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";
    private static final String ENDPOINT = "https://api.openai.com/v1/completions";

    private final ChatgptService chatgptService;

    public String generateText(String prompt, float temperature, int maxTokens) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + API_KEY);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "text-davinci-003");
        requestBody.put("prompt", prompt);
        requestBody.put("temperature", temperature);
        requestBody.put("max_tokens", maxTokens);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.postForEntity(ENDPOINT, requestEntity, Map.class);
        return response.toString();
    }

    @Async
    public CompletableFuture<String> getTitle(String code) throws InterruptedException {

        log.debug("start to generate code Title");

//        StringBuilder question = new StringBuilder("Could you please make a title for the code snippet below?\n");
        StringBuilder question = new StringBuilder("아래 코드를 해석해서 제목을 달아줘 \n");
        question.append(code);

        String title = chatgptService.sendMessage(question.toString());

        return CompletableFuture.completedFuture(title);
    }

    @Async
    public CompletableFuture<String> addComment(String code) throws InterruptedException {

        log.debug("start to generate code Comment");

//        StringBuilder question = new StringBuilder("아래의 코드에 설명 주석을 달아줘. 코드와 주석 외에는 답변하지 말아줘 : \n");
        StringBuilder question = new StringBuilder("아래 코드를 해석해서 주석을 달아줘 \n");
        question.append(code);

        String commentCode = chatgptService.sendMessage(question.toString());

        return CompletableFuture.completedFuture(commentCode);
    }

    @Async
    public CompletableFuture<String> getSummarize(String code) throws InterruptedException {

        log.debug("start to generate code Summarization");

        StringBuilder question = new StringBuilder("아래의 코드에 대한 한줄 평을 남겨줘 : \n");
        question.append(code);

        String summarization = chatgptService.sendMessage(question.toString());

        return CompletableFuture.completedFuture(summarization);
    }
}
