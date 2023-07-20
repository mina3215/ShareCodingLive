package com.codragon.sclive.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;


/**
 * Redis 설정
 *
 * @author MinSu
 */
@Configuration
public class RedisConfig {

    @Value("${spring.redis.host}")
    private String host;

    @Value("${spring.redis.port}")
    private int port;

    /**
     * get Thread-safe factory of Redis connections.
     *
     * @return LettuceConnectionFactory
     */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(host, port);
    }

    /**
     * Load Helper class that simplifies Redis data access code
     * TO-BE-Concerned:
     * redisTemplate <userId, RefreshToken>으로 사용하기에 <String, String>으로 설정
     * 추후에 다른 자료형의 데이터를 저장한다면, Generic Type 고려해보기
     *
     * @return RedisTemplate<String, String>
     */
    @Bean
    public RedisTemplate<?, ?> redisTemplate() {

        RedisTemplate<String, String>redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());

        return redisTemplate;
    }
}
