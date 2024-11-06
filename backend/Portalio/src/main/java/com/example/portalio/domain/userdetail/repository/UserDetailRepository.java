package com.example.portalio.domain.userdetail.repository;

import com.example.portalio.domain.userdetail.entity.UserDetail;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailRepository extends JpaRepository<UserDetail, Long> {

    UserDetail findByUserNickname(String nickname);

    Page<UserDetail> findAllByOrderByUserTicketDesc(Pageable pageable);
}
