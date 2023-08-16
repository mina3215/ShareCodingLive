package com.codragon.sclive.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;


@EnableAsync
@Configuration
public class AsyncConfig {

    @Bean(name = "taskExecutor", destroyMethod = "shutdown")
    public ThreadPoolTaskExecutor taskExecutor() {

        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(3);
        executor.setMaxPoolSize(3);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("ChatGPT-Thread");
        executor.initialize();

        return executor;
    }
}
