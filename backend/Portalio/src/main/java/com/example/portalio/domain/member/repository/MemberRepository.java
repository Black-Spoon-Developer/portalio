package com.example.portalio.domain.member.repository;

import com.example.portalio.domain.member.entity.Member;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
    
    // 회원 로그인 부분에서만 사용하기
    Optional<Member> findByMemberUsername(String username);

}
