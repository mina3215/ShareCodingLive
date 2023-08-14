package com.codragon.sclive.config;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.domain.UserEntity;
import com.codragon.sclive.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;


@Slf4j
@Configuration
@RequiredArgsConstructor
public class AuthenticationConfig {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public UserDetailsService userDetailsService() {

        return userEmail -> {
            UserDao findUser = userMapper.getUserByEmail(userEmail);

            log.debug("get User {} in loadUserByUsername", findUser);

            if (findUser == null) {
                throw new UsernameNotFoundException("아이디 혹은 비밀번호가 틀립니다.");
            }

            UserEntity user = UserEntity.builder()
                    .userEmail(findUser.getEmail())
                    .userPassword(findUser.getPassword())
                    .userNickname(findUser.getNickname())
                    .userRole(findUser.getRole())
                    .fcm_access_token(findUser.getFcm_access_token())
                    .build();

            return user;
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder);

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfig) throws Exception {
        return authenticationConfig.getAuthenticationManager();
    }
}
