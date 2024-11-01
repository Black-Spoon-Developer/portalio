package com.example.portalio.common.oauth.service;

import com.example.portalio.common.oauth.dto.*;
import com.example.portalio.domain.member.entity.UserEntity;
import com.example.portalio.domain.member.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println(oAuth2User);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        OAuth2Response oAuth2Response = null;

        if (registrationId.equals("naver")) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());

        } else if (registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());

        } else {
            return null;
        }
        
        // 리소스 서버에서 발급 받은 정보로 사용자를 특정할 아이디값을 만듬
        String username = oAuth2Response.getProvider()+ " " +oAuth2Response.getProviderId();
        UserEntity existData = userRepository.findByUsername(username);

        if (existData == null) {
            UserEntity userEntity = new UserEntity();
            userEntity.setUsername(username);
            userEntity.setEmail(oAuth2Response.getEmail());
            userEntity.setName(oAuth2Response.getName());
            userEntity.setRole("USER");

            userRepository.save(userEntity);

            UserDTO userDTO = UserDTO.builder()
                    .username(username)
                    .name(oAuth2Response.getName())
                    .role("USER")
                    .build();

            return new CustomOAuth2User(userDTO);

        } else {
            existData.setEmail(oAuth2Response.getEmail());
            existData.setName(oAuth2Response.getName());

            userRepository.save(existData);

            UserDTO userDTO = UserDTO.builder()
                    .username(existData.getUsername())
                    .name(oAuth2Response.getName())
                    .role(existData.getRole())
                    .build();

            return new CustomOAuth2User(userDTO);
        }






    }
}
