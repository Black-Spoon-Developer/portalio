package com.example.portalio.domain.userdetail.service;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.member.repository.MemberRepository;
import com.example.portalio.domain.userdetail.dto.*;
import com.example.portalio.domain.userdetail.entity.UserDetail;
import com.example.portalio.domain.userdetail.error.NoTicketAvailableException;
import com.example.portalio.domain.userdetail.error.NoUserDetailException;
import com.example.portalio.domain.userdetail.repository.UserDetailRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailService {

    private final UserDetailRepository userDetailRepository;
    private final MemberRepository memberRepository;

    // userDetail 정보 저장 - 닉네임
    public UserDetailDTO saveUserDetail(UserDetailRequest request) {
        String nickname = request.getMemberNickname();
        String memberId = request.getMemberId();
        Long parseMemberId = Long.parseLong(memberId);

        Member member = memberRepository.findById(parseMemberId)
                .orElseThrow(MemberNotFoundException::new);

        UserDetail userDetail = userDetailRepository.findByMemberId(parseMemberId)
                .orElseThrow(NoUserDetailException::new);
        

        // 닉네임 설정
        userDetail.setUserNickname(nickname);

        UserDetail savedUserDetail = userDetailRepository.save(userDetail);
        System.out.println(savedUserDetail.getUserNickname());

        return UserDetailDTO.from(savedUserDetail);
    }

    // 닉네임 중복 검사 API
    public boolean checkDuplicateNickname(String nickname) {
        UserDetail userDetail = userDetailRepository.findByUserNickname(nickname);

        if (userDetail != null) {
            return false;
        }

        return true;
    }

    public TicketResponse updateTicket(Integer ticketCount, CustomOAuth2User oauth2User) {

        UserDetail userDetail = userDetailRepository.findById(oauth2User.getMemberId())
                .orElseThrow(MemberNotFoundException::new);

        if (userDetail.getUserTicket() + ticketCount < 0) {
            throw new NoTicketAvailableException();
        }
        userDetail.setUserTicket(userDetail.getUserTicket() + ticketCount);

        userDetailRepository.save(userDetail);

        return TicketResponse.from(userDetail);
    }

    public List<TicketRankingResponse> getTicketRanking(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);

        return userDetailRepository.findAllByOrderByUserTicketDesc(pageRequest)
                .stream()
                .map(user -> {
                    UserDetailDTO userDetailDTO = UserDetailDTO.from(user);
                    return new TicketRankingResponse(userDetailDTO.getMemberId(), userDetailDTO.getUserTicket());})
                .collect(Collectors.toList());
    }
    
    // 유저 소셜링크 조회
    public UserSocialLinkResponse getUserSocialLink(String memberUsername) {
        UserDetail userDetail = userDetailRepository.findByMember_MemberUsername(memberUsername)
                .orElseThrow(NoUserDetailException::new);

        return UserSocialLinkResponse.from(userDetail);

    }

    // 유저 소셜링크 저장 및 수정
    public UserSocialLinkResponse saveUserSocialLink(CustomOAuth2User oauth2User, UserSocialLinkRequest request) {
        Long memberId = oauth2User.getMemberId();

        UserDetail userDetail = userDetailRepository.findByMemberId(memberId)
                .orElseThrow(NoUserDetailException::new);

        userDetail.setUserFacebook(request.getFacebook());
        userDetail.setUserInstagram(request.getInstagram());
        userDetail.setUserLinkedin(request.getLinkedin());
        userDetail.setUserGithub(request.getGithub());

        UserDetail savedUserDetail = userDetailRepository.save(userDetail);

        return  UserSocialLinkResponse.from(savedUserDetail);
    }

    // 유저 자기소개 조회
    public UserIntroductionResponse getIntroductionByMemberUsername(String memberUsername) {
        UserDetail userDetail = userDetailRepository.findByMember_MemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        return UserIntroductionResponse.from(userDetail);
    }

    // 유저 자기소개 저장 및 수정
    public UserIntroductionResponse saveIntroduction(CustomOAuth2User oAuth2User, UserIntroductionRequest request) {
        Long memberId = oAuth2User.getMemberId();
        UserDetail userDetail = userDetailRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 자기소개 데이터 업데이트
        userDetail.setUserIntroductionTitle(request.getUserIntroductionTitle());
        userDetail.setUserIntroductionContent(request.getUserIntroductionContent());
        userDetailRepository.save(userDetail);

        return UserIntroductionResponse.from(userDetail);
    }
}
