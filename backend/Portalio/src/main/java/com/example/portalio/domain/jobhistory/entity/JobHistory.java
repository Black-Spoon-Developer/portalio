package com.example.portalio.domain.jobhistory.entity;

import com.example.portalio.domain.jobhistory.dto.JobHistoryRequest;
import com.example.portalio.domain.member.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.YearMonth;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "job_history")
public class JobHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_history_id")
    private Long jobHistoryId;

    @Column(name = "job_company")
    private String jobCompany;

    @Column(name = "job_position")
    private String jobPosition;

    @Column(name = "job_start_date")
    private YearMonth jobStartDate;

    @Column(name = "job_end_date")
    private YearMonth jobEndDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    public void setJobCompany(String jobCompany) {this.jobCompany = jobCompany;}
    public void setJobPosition(String jobPosition) {this.jobPosition = jobPosition;}
    public void setJobStartDate(String jobStartDate) {this.jobStartDate = YearMonth.parse(jobStartDate);}
    public void setJobEndDate(String jobEndDate) {this.jobEndDate = YearMonth.parse(jobEndDate);}

    private JobHistory(Member member, JobHistoryRequest request) {
        this.jobCompany = request.getJobCompany();
        this.jobPosition = request.getJobPosition();
        this.jobStartDate = request.getJobStartDate();
        this.jobEndDate = request.getJobEndDate();
        this.member = member;
    }

    public static JobHistory of(Member member, JobHistoryRequest request) {
        return new JobHistory(member, request);
    }
}
