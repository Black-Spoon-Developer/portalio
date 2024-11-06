//package com.example.portalio.domain.userhopejob.service;
//
//import com.example.portalio.domain.jobsubcategory.entity.JobSubCategory;
//import com.example.portalio.domain.jobsubcategory.repository.JobSubCategoryRepository;
//import com.example.portalio.domain.member.entity.Member;
//import com.example.portalio.domain.member.repository.MemberRepository;
//import com.example.portalio.domain.userhopejob.entity.UserHopeJob;
//import com.example.portalio.domain.userhopejob.repository.UserhopejobRepository;
//import jakarta.persistence.EntityNotFoundException;
//import org.springframework.stereotype.Service;
//
//@Service
//public class UserhopejobService {
//
//    private final UserhopejobRepository userhopejobRepository;
//    private final MemberRepository memberRepository;
//    private final JobSubCategoryRepository jobSubCategoryRepository;
//
//
//    public UserhopejobService(UserhopejobRepository userhopejobRepository, MemberRepository memberRepository,
//                              JobSubCategoryRepository jobSubCategoryRepository) {
//        this.userhopejobRepository = userhopejobRepository;
//        this.memberRepository = memberRepository;
//        this.jobSubCategoryRepository = jobSubCategoryRepository;
//    }
//
//    // 유저 직무 정보 저장
//    public UserHopeJob saveUserHopeJob(Long jobId, Long memberId) {
//        JobSubCategory jobSubCategory = jobSubCategoryRepository.findById(jobId)
//                .orElseThrow(() -> new EntityNotFoundException("직무 카테고리를 찾을 수 없습니다."));
//
//        Member member = memberRepository.findById(memberId)
//                .orElseThrow(() -> new EntityNotFoundException("회원 정보를 찾을 수 없습니다."));
//
//        UserHopeJob userHopeJob = UserHopeJob.of(jobSubCategory, member);
//
//        return userhopejobRepository.save(userHopeJob);
//    }
//
//
//}
