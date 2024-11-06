package com.example.portalio.domain.userdetail.service;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.member.repository.MemberRepository;
import com.example.portalio.domain.userdetail.dto.UserDetailRequest;
import com.example.portalio.domain.userdetail.dto.TicketRankingResponse;
import com.example.portalio.domain.userdetail.dto.TicketResponse;
import com.example.portalio.domain.userdetail.entity.UserDetail;
import com.example.portalio.domain.userdetail.error.NoTicketAvailableException;
import com.example.portalio.domain.userdetail.repository.UserDetailRepository;
import java.util.Optional;
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

    // userDetail 정보 저장 - 닉네임, 이메일
    public UserDetail saveUserDetail(UserDetailRequest request) {
        String nickname = request.getNickname();
        String email = request.getEmail();
        String memberId = request.getMemberId();
        Long parseMemberId = Long.parseLong(memberId);

        Member member = memberRepository.findById(parseMemberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found with id: " + memberId));

        UserDetail userDetail = UserDetail.of(email, nickname, member);

        return userDetailRepository.save(userDetail);
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

        return TicketResponse.from(userDetail);
    }

    public List<TicketRankingResponse> getTicketRanking(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);

        return userDetailRepository.findAllByOrderByUserTicketDesc(pageRequest)
                .stream()
                .map(user -> new TicketRankingResponse(user.getMember().getMemberId(), user.getUserTicket()))
                .collect(Collectors.toList());
    }

}
