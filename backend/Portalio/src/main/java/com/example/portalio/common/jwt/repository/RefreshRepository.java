package com.example.portalio.common.jwt.repository;

import com.example.portalio.common.jwt.entity.RefreshEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshRepository extends JpaRepository<RefreshEntity, Long> {

    Boolean existsByValue(String refresh);

    @Transactional
    void deleteByValue(String refresh);

}
