package com.example.portalio.domain.member.service;

import com.example.portalio.domain.jobsubcategory.entity.JobSubCategory;
import com.example.portalio.domain.jobsubcategory.error.JobSubCategoryNotFoundException;
import com.example.portalio.domain.jobsubcategory.repository.JobSubCategoryRepository;
import com.example.portalio.domain.member.dto.MemberDTO;
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
    public MemberDTO authMember(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);

        member.setMemberAuth();

        MemberDTO memberDTO = MemberDTO.from(memberRepository.save(member));


        return memberDTO;
    }

    // 회원 직무 정보 저장
    public MemberDTO jobInfoSave(Long memberId, Long subCategoryId) {

        // 회원 정보 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);

        // 직무 정보 조회
        JobSubCategory jobSubCategory = jobSubCategoryRepository.findByJobId(subCategoryId).orElseThrow(
                JobSubCategoryNotFoundException::new);

        member.addJobSubCategory(jobSubCategory);

        MemberDTO memberDTO = MemberDTO.from(memberRepository.save(member));

        return memberDTO;
    }


}
