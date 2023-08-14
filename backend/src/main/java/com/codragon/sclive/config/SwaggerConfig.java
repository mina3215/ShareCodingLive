package com.codragon.sclive.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.builders.RequestParameterBuilder;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.service.ParameterType;
import springfox.documentation.service.RequestParameter;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Collections;
import java.util.List;


@Slf4j
@Configuration
@EnableSwagger2
public class SwaggerConfig {

    /**
     * Swagger에서 API 호출 시
     * Header에 AccessToken 넣는 Input창 생성
     */
    private List<RequestParameter> initParameters() {

        RequestParameter accessToken = new RequestParameterBuilder()
                .name("Authorization")
                .description("Access-Token")
                .in(ParameterType.HEADER)
                .required(false)
                .build();

        List<RequestParameter> parameters = List.of(accessToken);

        log.debug("create Swagger Global Parameter");

        return parameters;
    }

    @Bean
    public Docket api() {

        return new Docket(DocumentationType.SWAGGER_2)
//                .host("i9d109.p.ssafy.io:8094/api")
                .globalRequestParameters(initParameters())
                .select()
                .apis(RequestHandlerSelectors.any())
                .paths(PathSelectors.any())
                .build()
                .apiInfo(apiInfo());
    }

    private ApiInfo apiInfo() {

        return new ApiInfo(
                "코드래곤 Backend API",
                "Share-Coding-Live",
                "V1",
                "Terms of service",
                new Contact("administrator", "www.ssafy.com", "administrator@email.com"),
                "License of API",
                "www.ssafy.com",
                Collections.emptyList()
        );
    }
}