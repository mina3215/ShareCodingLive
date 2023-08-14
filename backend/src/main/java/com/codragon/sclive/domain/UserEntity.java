package com.codragon.sclive.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


@Getter
@Builder
@ToString
public class UserEntity implements UserDetails {

    private String userEmail;

    private String userNickname;

    private String userPassword;

    private String userRole;

    private String fcm_access_token;

    public String getUserRole() {
        final String PREFIX = "ROLE_";
        return PREFIX.concat(userRole);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(getUserRole()));
    }

    @Override
    public String getPassword() {
        return this.userPassword;
    }

    @Override
    public String getUsername() {
        return this.userEmail;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
