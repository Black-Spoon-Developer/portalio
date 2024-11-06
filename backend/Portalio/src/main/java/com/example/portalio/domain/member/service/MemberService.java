package com.example.portalio.domain.member.service;

import com.example.portalio.domain.jobsubcategory.entity.JobSubCategory;
import com.example.portalio.domain.jobsubcategory.error.JobSubCategoryNotFoundException;
import com.example.portalio.domain.jobsubcategory.repository.JobSubCategoryRepository;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final JobSubCategoryRepository jobSubCategoryRepository;

    // 회원 정보 입력 후 인증 해주는 로직
    public Member authMember(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);

        member.setMemberAuth();

        return memberRepository.save(member);
    }

    // 회원 직무 정보 저장
    public Member jobInfoSave(Long memberId, Long subCategoryId) {
        // 회원 정보 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);

        // 직무 정보 조회
        JobSubCategory jobSubCategory = jobSubCategoryRepository.findByJobId(subCategoryId).orElseThrow(
                JobSubCategoryNotFoundException::new);

        member.addJobSubCategory(jobSubCategory);

        return memberRepository.save(member);
    }

//    // 회원정보 이메일로 조회
//    public Member memberEmailGet(String email) {
//        Member member = memberRepository.findByMemberEmail(email);
//        return member;
//    }
//
//    // 회원정보 수정
//    @Transactional
//    public Member memberUpdate(String email, MemberRequestDTO requestDTO) {
//        Member member = memberRepository.findByMemberEmail(email);
//
//        if (member == null) {
//            throw new IllegalArgumentException("회원을 조회할 수 없습니다.");
//        }
//
//        if (requestDTO.getMemberNickname() != null) {
//            member.setMemberNickname(requestDTO.getMemberNickname());
//        }
//
//        if (requestDTO.getMemberPicture() != null) {
//            member.setMemberPicture(requestDTO.getMemberPicture());
//        }
//
//        return member;
//    }

//    // 회원 닉네임 설정 및 수정
//    public Member memberNicknameSave(String email, String nickname) {
//        // 이메일로 회원 정보 조회
//        Member member = memberRepository.findByMemberEmail(email);
//
//        // 닉네임 설정 및 수정
//        member.setMemberNickname(nickname);
//
//        // 멤버 객체 저장
//        memberRepository.save(member);
//
//        return member;
//    }

}
