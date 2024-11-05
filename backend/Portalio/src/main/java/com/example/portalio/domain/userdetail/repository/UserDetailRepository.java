package com.example.portalio.domain.userdetail.repository;

import com.example.portalio.domain.userdetail.entity.UserDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailRepository extends JpaRepository<UserDetail, Long> {
}
