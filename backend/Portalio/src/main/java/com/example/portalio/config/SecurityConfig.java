package com.example.portalio.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
//    private final MyAuthenticationSuceessHandler oAuth2LoginSuccessHandler;
//    private final JwtAuthFilter jwtAuthFilter;
//    private final CustomOAuth2UserService customOAuth2UserService;
//    private final MyAuthenticationFailureHandler oAuth2LoginFailureHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .httpBasic(AbstractHttpConfigurer::disable) // HTTP 기본 인증을 비활성화
                .cors() // CORS 활성화
                .csrf(AbstractHttpConfigurer::disable)  // CSRF 보호를 비활성화합니다.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 관리 정책을 STATELESS(세션이 있으면 쓰지도 않고, 없으면 만들지도 않는다)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/v1/users/reissue").permitAll() // 토큰 발급 경로 허용
                        .requestMatchers("/api/v1/users/")
                        .requestMatchers("/", "/css/**", "/images/**", "/js/**", "/favicon.ico", "/h2-console/**").permitAll() // OAuth 로그인 사용
                        .anyRequest().authenticated() // 그 외 요청은 인증 필요
                );

        // JWT 인증 필터를 UsernamePasswordAuthenticationFilter 앞에 추가한다.
        return http.addFilter(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();

    }
}