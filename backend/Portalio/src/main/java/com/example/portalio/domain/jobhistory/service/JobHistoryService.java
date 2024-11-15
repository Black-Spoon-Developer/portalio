package com.example.portalio.domain.jobhistory.service;

import com.example.portalio.domain.jobhistory.dto.JobHistoryListResponse;
import com.example.portalio.domain.jobhistory.dto.JobHistoryRequest;
import com.example.portalio.domain.jobhistory.dto.JobHistoryResponse;
import com.example.portalio.domain.jobhistory.entity.JobHistory;
import com.example.portalio.domain.jobhistory.error.JobHistoryNotFoundException;
import com.example.portalio.domain.jobhistory.repository.JobHistoryRepository;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.member.repository.MemberRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.batch.BatchProperties.Job;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobHistoryService {

    private final JobHistoryRepository jobHistoryRepository;
    private final MemberRepository memberRepository;

    // 유저 경력/이력 전체 조회
    public JobHistoryListResponse getJobHistoryList(Long memberId) {

        List<JobHistory> jobHistories = jobHistoryRepository.findAllByMember_MemberId(memberId);

        return JobHistoryListResponse.from(jobHistories);
    }

    // 유저 경력/이력 저장
    public JobHistoryResponse saveJobHistory(Long memberId, JobHistoryRequest request) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);

        JobHistory jobHistory = JobHistory.of(member, request);

        JobHistory savedJobHistory = jobHistoryRepository.save(jobHistory);

        return JobHistoryResponse.from(savedJobHistory);
    }
    
    // 유저 경력/이력 삭제
    public JobHistoryResponse deleteJobHistory(Long jobHistoryId) {
        JobHistory jobHistory = jobHistoryRepository.findByJobHistoryId(jobHistoryId)
                .orElseThrow(JobHistoryNotFoundException::new);

        jobHistoryRepository.delete(jobHistory);

        return JobHistoryResponse.from(jobHistory);
    }

}
