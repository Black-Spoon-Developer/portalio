package com.example.portalio.common.security.config;

import com.example.portalio.common.jwt.filter.JwtAuthFilter;
import com.example.portalio.common.jwt.filter.JwtExceptionFilter;
import com.example.portalio.common.oauth.CustomOAuth2UserService;
import com.example.portalio.common.oauth.handler.MyAuthenticationFailureHandler;
import com.example.portalio.common.oauth.handler.MyAuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class SecurityConfig {
    private final MyAuthenticationSuccessHandler oAuth2LoginSuccessHandler;
    private final MyAuthenticationFailureHandler oAuth2LoginFailureHandler;
    private final JwtAuthFilter jwtAuthFilter;
    private final JwtExceptionFilter jwtExceptionFilter;
    private final CustomOAuth2UserService customOAuth2UserService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .httpBasic(AbstractHttpConfigurer::disable) // HTTP 기본 인증을 비활성화
                .cors(Customizer.withDefaults()) // CORS 활성화
                .csrf(AbstractHttpConfigurer::disable)  // CSRF 보호를 비활성화
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 관리 정책을 STATELESS(세션이 있으면 쓰지도 않고, 없으면 만들지도 않는다
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/v1/users/reissue").permitAll() // 토큰 발급 경로 허용
                        .requestMatchers("/api/v1/users/login", "/api/v1/users/signup").permitAll()
                        .requestMatchers("/api/v1/recruiter/login", "/api/v1/recruiter/signup").permitAll()
                        .requestMatchers("/", "/css/**", "/images/**", "/js/**", "/favicon.ico", "/h2-console/**").permitAll() // OAuth 로그인 사용
                        .anyRequest().authenticated() // 그 외 요청은 인증 필요
                )
                .oauth2Login() // OAuth2 로그인 시작
                .userInfoEndpoint().userService(customOAuth2UserService) // OAuth 로그인시 사용자 정보를 가져오는 엔드포인트와 사용자 서비스를 설정
                .failureHandler(oAuth2LoginFailureHandler) // OAuth2 로그인 실패시 처리할 핸들러 저장
                .successHandler(oAuth2LoginSuccessHandler); // OAuth2 로그인 성공시 처리할 핸들러 저장

        // JWT 인증 필터를 UsernamePasswordAuthenticationFilter 앞에 추가한다.
        return http
                .addFilterBefore(jwtExceptionFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();

    }
}