package com.codragon.sclive.chat;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;


@Slf4j
@SpringBootTest
class ChatGPTUtilTest {

    @Autowired
    ChatGPTUtil chatGPTUtil;

    final String code = "```\n" +
            "@app.route('/board')\n" +
            "def board():\n" +
            "    return \"그냥 보드\"\n" +
            "\n" +
            "@app.route('/board/<article_idx>')\n" +
            "def board_view(article_idx):\n" +
            "    return article_idx\n" +
            "\n" +
            "@app.route('/boards',defaults={'page':'index'})\n" +
            "@app.route('/boards/<page>')\n" +
            "def boards(page):\n" +
            "    return page+\"페이지입니다.\"\n" +
            "```";

    @Test
    @DisplayName("코드 제목, 요약, 주석 달기")
    void getTitle() throws ExecutionException, InterruptedException {

        log.debug("prepare to send User's Code to ChatGPT");
        long start = System.currentTimeMillis();

        CompletableFuture<String> title = chatGPTUtil.getTitle(code);
        CompletableFuture<String> summarize = chatGPTUtil.getSummarize(code);
        CompletableFuture<String> comment = chatGPTUtil.addComment(code);

        CompletableFuture.allOf(title,summarize,comment).join();

        log.info("Elapsed time: " + (System.currentTimeMillis() - start));
        log.info("title: {}", title.get());
        log.info("summarize: {}", summarize.get());
        log.info("comment: {}", comment.get());
    }
}