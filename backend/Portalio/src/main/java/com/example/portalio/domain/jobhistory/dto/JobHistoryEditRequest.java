package com.example.portalio.domain.jobhistory.dto;

import java.time.YearMonth;
import lombok.Getter;

@Getter
public class JobHistoryEditRequest {
    private Long jobHistoryId;
    private String jobCompany;
    private String jobPosition;
    private YearMonth jobStartDate;
    private YearMonth jobEndDate;
}
