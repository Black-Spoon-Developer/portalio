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

    // 회원정보 조회
    public Member memberGet(String email) {
        Member member = memberRepository.findByMemberEmail(email);
        return member;
    }

    // 회원정보 수정
    @Transactional
    public Member memberUpdate(String email, MemberRequestDTO requestDTO) {
        Member member = memberRepository.findByMemberEmail(email);

        if (member == null) {
            throw new IllegalArgumentException("Member not found with email" + email);
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
