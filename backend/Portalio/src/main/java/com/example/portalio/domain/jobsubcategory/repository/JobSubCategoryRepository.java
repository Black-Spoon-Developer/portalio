package com.example.portalio.domain.jobsubcategory.repository;

import com.example.portalio.domain.jobsubcategory.entity.JobSubCategory;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobSubCategoryRepository extends JpaRepository<JobSubCategory, Long> {

    Optional<JobSubCategory> findByJobId(Long jobId);
}
