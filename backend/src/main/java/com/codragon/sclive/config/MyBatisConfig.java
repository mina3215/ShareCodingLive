package com.codragon.sclive.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan(basePackages = "com.codragon.sclive.mapper")
public class MyBatisConfig {
	
}