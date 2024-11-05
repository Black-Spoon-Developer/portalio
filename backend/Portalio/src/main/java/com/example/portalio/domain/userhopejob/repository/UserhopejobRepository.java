package com.example.portalio.domain.userhopejob.repository;

import com.example.portalio.domain.userhopejob.entity.UserHopeJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserhopejobRepository extends JpaRepository<UserHopeJob, Long> {

}
