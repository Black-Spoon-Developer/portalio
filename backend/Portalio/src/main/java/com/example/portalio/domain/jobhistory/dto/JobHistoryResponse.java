package com.example.portalio.domain.jobhistory.dto;

import com.example.portalio.domain.jobhistory.entity.JobHistory;
import java.time.YearMonth;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class JobHistoryResponse {
    private Long jobHistoryId;
    private String jobCompany;
    private String jobPosition;
    private YearMonth jobStartDate;
    private YearMonth jobEndDate;


    public static JobHistoryResponse from(JobHistory jobHistory) {
        return JobHistoryResponse.builder()
                .jobHistoryId(jobHistory.getJobHistoryId())
                .jobCompany(jobHistory.getJobCompany())
                .jobPosition(jobHistory.getJobPosition())
                .jobStartDate(jobHistory.getJobStartDate())
                .jobEndDate(jobHistory.getJobEndDate())
                .build();
    }

}
