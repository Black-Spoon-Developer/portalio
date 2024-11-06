package com.example.portalio.domain.member.repository;

import com.example.portalio.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Member findByMemberUsername(String username);

    Member findByMemberNickname(String nickname);
}
