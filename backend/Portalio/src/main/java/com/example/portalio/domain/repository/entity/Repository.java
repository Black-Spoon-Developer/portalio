package com.example.portalio.domain.repository.entity;

import com.example.portalio.domain.activityboard.entity.ActivityBoard;
import com.example.portalio.domain.common.entity.AuditableCreatedEntity;
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
public class Repository extends AuditableCreatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "repository_id")
    private Long repositoryId;

    @Column(name = "repository_title", nullable = false, length = 50)
    private String repositoryTitle;

    @Column(name = "repository_description", nullable = false, columnDefinition = "TEXT")
    private String repositoryDescription;

    @Column(name = "repository_content", nullable = false, columnDefinition = "TEXT")
    private String repositoryContent;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "repository_file_key", nullable = false, columnDefinition = "TEXT")
    private String repositoryFileKey;

    @Column(name = "repository_post", nullable = false)
    private Boolean repositoryPost = false;

    @Column(name = "repository_is_primary", nullable = false)
    private Boolean repositoryIsPrimary = false;

    @OneToMany(mappedBy = "repository")
    private List<ActivityBoard> activityBoards = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private Repository(String repositoryTitle, String repositoryDescription, String repositoryContent, LocalDate startDate, LocalDate endDate, String repositoryFileKey, Boolean repositoryPost, Member member) {
        this.repositoryTitle = repositoryTitle;
        this.repositoryDescription = repositoryDescription;
        this.repositoryContent = repositoryContent;
        this.startDate = startDate;
        this.endDate = endDate;
        this.repositoryFileKey = repositoryFileKey;
        this.repositoryPost = repositoryPost;
        this.member = member;
    }

    public static Repository of(String repositoryTitle, String repositoryDescription, String repositoryContent, LocalDate startDate, LocalDate endDate, String repositoryFileKey, Boolean repositoryPost, Member member) {
        return new Repository(repositoryTitle, repositoryDescription, repositoryContent, startDate, endDate, repositoryFileKey, repositoryPost, member);
    }

    public void setRepositoryTitle(String repositoryTitle) { this.repositoryTitle = repositoryTitle; }

    public void setRepositoryContent(String repositoryContent) { this.repositoryContent = repositoryContent; }

    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public void setRepositoryFileKey(String repositoryFileKey) { this.repositoryFileKey = repositoryFileKey; }

    public void setRepositoryPost(Boolean repositoryPost) { this.repositoryPost = repositoryPost; }

    public void setRepositoryIsPrimary(Boolean repisitoryIsPrimary) { this.repositoryIsPrimary = repisitoryIsPrimary; }

    public void setRepositoryDescription(String repositoryDescription) { this.repositoryDescription = repositoryDescription; }
}
