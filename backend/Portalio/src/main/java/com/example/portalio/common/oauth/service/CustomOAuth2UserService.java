package com.example.portalio.common.oauth.service;

import com.example.portalio.common.oauth.dto.*;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.enums.Role;
import com.example.portalio.domain.member.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    public CustomOAuth2UserService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
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
        String name = oAuth2Response.getName();
        String email = oAuth2Response.getEmail();
        String picture = oAuth2Response.getPicture();

        Member existData = memberRepository.findByMemberUsername(username);


        if (existData == null) {

            Member member = Member.builder()
                    .memberName(name)
                    .memberUsername(username)
                    .memberEmail(email)
                    .memberPicture(picture)
                    .memberRole(Role.USER)
                    .build();

            memberRepository.save(member);

            UserDTO userDTO = UserDTO.builder()
                    .username(username)
                    .name(name)
                    .role("USER")
                    .isNewUser(true)
                    .build();

            return new CustomOAuth2User(userDTO);

        } else {

            Member updateMember = Member.builder()
                    .memberName(name)
                    .memberUsername(username)
                    .memberPicture(picture)
                    .memberRole(Role.USER)
                    .memberEmail(email)
                    .build();

            memberRepository.save(updateMember);

            UserDTO userDTO = UserDTO.builder()
                    .username(existData.getMemberUsername())
                    .name(name)
                    .role("USER")
                    .isNewUser(false)
                    .build();


            return new CustomOAuth2User(userDTO);
        }






    }
}
