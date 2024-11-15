package com.example.portalio.domain.jobhistory.dto;

import com.example.portalio.domain.jobhistory.entity.JobHistory;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class JobHistoryListResponse {

    private final List<JobHistoryResponse> items;

    public static JobHistoryListResponse from(List<JobHistory> jobHistories) {
        List<JobHistoryResponse> items = jobHistories.stream()
                .map(JobHistoryResponse::from)
                .toList();

        return new JobHistoryListResponse(items);
    }
}
