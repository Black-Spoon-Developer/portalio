package com.example.portalio.domain.jobhistory.dto;

import java.time.YearMonth;
import lombok.Getter;

@Getter
public class JobHistoryRequest {
    private String jobCompany;
    private String jobPosition;
    private YearMonth jobStartDate;
    private YearMonth jobEndDate;
}
