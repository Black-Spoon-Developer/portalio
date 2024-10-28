package com.example.portalio.domain.repository.entity;

import com.example.portalio.domain.activityboard.entity.ActivityBoard;
import com.example.portalio.domain.member.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "repository")
public class Repository {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "repository_id")
    private Long repositoryId;

    @Column(name = "repository_title", nullable = false, length = 50)
    private String repositoryTitle;

    @Column(name = "repository_content", nullable = false, columnDefinition = "TEXT")
    private String repositoryContent;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "repository_img_key", nullable = false, columnDefinition = "TEXT")
    private String repositoryImgKey;

    @Column(name = "repository_file_key", nullable = false, columnDefinition = "TEXT")
    private String repositoryFileKey;

    @OneToMany(mappedBy = "repository")
    private List<ActivityBoard> activityBoards = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;
}
