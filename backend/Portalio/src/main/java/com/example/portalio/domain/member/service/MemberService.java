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

    // 닉네임 중복 체크
    public boolean nicknameDupliCheck(String nickname) {

        Member member = memberRepository.findByMemberNickname(nickname);

        boolean isDuplicate = false;

        if (member != null) {
            isDuplicate = true;
        }

        return isDuplicate;

    }

    // 회원 닉네임 설정 및 수정
    public Member memberNicknameSave(String email, String nickname) {
        // 이메일로 회원 정보 조회
        Member member = memberRepository.findByMemberEmail(email);

        // 닉네임 설정 및 수정
        member.setMemberNickname(nickname);

        // 멤버 객체 저장
        memberRepository.save(member);

        return member;
    }

}