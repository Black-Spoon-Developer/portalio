package com.example.portalio.domain.userhopejob.entity;

import com.example.portalio.domain.jobsubcategory.entity.JobSubCategory;
import com.example.portalio.domain.member.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@IdClass(UserHopeJobId.class)
@Table(name = "user_hope_job")
public class UserHopeJob {

    @Id
    @Column(name = "job_id")
    private Long jobId;

    @Id
    @Column(name = "member_id")
    private Long memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", insertable = false, updatable = false)
    private JobSubCategory jobSubCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", insertable = false, updatable = false)
    private Member member;

    public static UserHopeJob of(JobSubCategory jobSubCategory, Member member) {
        UserHopeJob userHopeJob = new UserHopeJob();
        userHopeJob.jobId = jobSubCategory.getJobId();
        userHopeJob.memberId = member.getMemberId();
        userHopeJob.addRelation(jobSubCategory, member);
        return userHopeJob;
    }

    // 연관관계 설정 메서드
    public void addRelation(JobSubCategory jobSubCategory, Member member) {
        if (this.jobSubCategory != null) {
            this.jobSubCategory.getUserHopeJobs().remove(this);
        }
        this.jobSubCategory = jobSubCategory;
        jobSubCategory.getUserHopeJobs().add(this);

        if (this.member != null) {
            this.member.getUserHopeJobs().remove(this);
        }

        this.member = member;
        member.getUserHopeJobs().add(this);
    }


}
