package com.example.portalio.common.security.config;

import com.example.portalio.common.jwt.filter.JwtFilter;
import com.example.portalio.common.jwt.util.JwtUtil;
import com.example.portalio.common.oauth.handler.CustomSuccessHandler;
import com.example.portalio.common.oauth.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity(debug = true)
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;
    private final JwtUtil jwtUtil;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService, CustomSuccessHandler customSuccessHandler, JwtUtil jwtUtil) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.customSuccessHandler = customSuccessHandler;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // csrf disable
        http
                .csrf(AbstractHttpConfigurer::disable);  // CSRF 보호를 비활성화

        // cors 활성화
        http
                .cors(Customizer.withDefaults()); // CORS 활성화

        // Form 로그인 방식 disable
        http
                .formLogin(AbstractHttpConfigurer::disable);

        // HTTP Basic 인증 방식 disable
        http
                .httpBasic(AbstractHttpConfigurer::disable); // HTTP 기본 인증을 비활성화
        
        // JwtFilter 추가
        http
                .addFilterBefore(new JwtFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        // oauth2
        http
                .oauth2Login((oAuth2) -> oAuth2
                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
                                .userService(customOAuth2UserService))
                        .successHandler(customSuccessHandler));
        
        // 경로별 인가 작업
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/").permitAll()
                        .requestMatchers("/api/v1/users/reissue").permitAll()
                        .requestMatchers("/api/v1/users/login", "/api/v1/users/signup").permitAll()
                        .requestMatchers("/api/v1/recruiter/login", "/api/v1/recruiter/signup").permitAll()
                        .requestMatchers("/", "/css/**", "/images/**", "/js/**", "/favicon.ico", "/h2-console/**").permitAll()
                        .anyRequest().authenticated());

        // 세션 설정 : STATELESS
        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        return http.build();

    }
}