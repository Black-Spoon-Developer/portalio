package com.example.portalio.domain.jobmajorcategory.entity;

import com.example.portalio.domain.jobsubcategory.entity.JobSubCategory;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "job_major_category")
public class JobMajorCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "industry_id")
    private Long industryId;

    @Column(name = "industry_name", nullable = false, length = 50)
    private String industryName;

    @OneToMany(mappedBy = "jobMajorCategory", fetch = FetchType.LAZY)
    private List<JobSubCategory> jobSubCategories = new ArrayList<>();
}
