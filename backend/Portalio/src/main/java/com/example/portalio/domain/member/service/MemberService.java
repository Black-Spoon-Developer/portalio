package com.example.portalio.domain.member.service;

import com.example.portalio.domain.member.dto.MemberRequestDTO;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    // 회원정보 토큰으로 조회
    public Member memberTokenGet(String username) {
        Member member = memberRepository.findByMemberUsername(username);
        return member;
    }

    // 회원정보 이메일로 조회
    public Member memberEmailGet(String email) {
        Member member = memberRepository.findByMemberEmail(email);
        return member;
    }

    // 회원정보 수정
    @Transactional
    public Member memberUpdate(String email, MemberRequestDTO requestDTO) {
        Member member = memberRepository.findByMemberEmail(email);

        if (member == null) {
            throw new IllegalArgumentException("회원을 조회할 수 없습니다.");
        }

        if (requestDTO.getMemberNickname() != null) {
            member.setMemberNickname(requestDTO.getMemberNickname());
        }

        if (requestDTO.getMemberPicture() != null) {
            member.setMemberPicture(requestDTO.getMemberPicture());
        }

        return member;
    }

}
