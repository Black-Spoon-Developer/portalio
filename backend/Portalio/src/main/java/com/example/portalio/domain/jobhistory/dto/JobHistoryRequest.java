package com.example.portalio.domain.jobhistory.dto;

import java.time.YearMonth;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class JobHistoryRequest {
    private String company;
    private String position;
    private YearMonth startDate;
    private YearMonth endDate;
}
