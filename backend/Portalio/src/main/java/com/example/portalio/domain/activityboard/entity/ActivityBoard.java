package com.example.portalio.domain.activityboard.entity;

import com.example.portalio.domain.common.entity.AuditableCreatedEntity;
import com.example.portalio.domain.repository.entity.Repository;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "activity_board")
public class ActivityBoard extends AuditableCreatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_board_id")
    private Long activityBoardId;

    @Column(name = "activity_board_title", nullable = false)
    private String activityBoardTitle;

    @Column(name = "activity_board_content", nullable = false, columnDefinition = "TEXT")
    private String activityBoardContent;

    @Column(name = "activity_board_date", nullable = false)
    private LocalDate activityBoardDate;

    @Column(name = "activity_board_img_key", nullable = false, columnDefinition = "TEXT")
    private String activityBoardImgKey;

    @Column(name = "activity_board_post", nullable = false)
    private Boolean activityBoardPost = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id")
    private Repository repository;

    private ActivityBoard(String activityBoardTitle, String activityBoardContent, LocalDate activityBoardDate, String activityBoardImgKey, Boolean activityBoardPost) {
        this.activityBoardTitle = activityBoardTitle;
        this.activityBoardContent = activityBoardContent;
        this.activityBoardDate = activityBoardDate;
        this.activityBoardImgKey = activityBoardImgKey;
        this.activityBoardPost = activityBoardPost;
    }

    public static ActivityBoard of(String activityBoardTitle, String activityBoardContent, LocalDate activityBoardDate, String activityBoardImgKey, Boolean activityBoardPost) {
        return new ActivityBoard(activityBoardTitle, activityBoardContent, activityBoardDate, activityBoardImgKey, activityBoardPost);
    }

    public void setActivityBoardTitle(String activityBoardTitle) {
        this.activityBoardTitle = activityBoardTitle;
    }

    public void setActivityBoardContent(String activityBoardContent) {
        this.activityBoardContent = activityBoardContent;
    }

    public void setActivityBoardDate(LocalDate activityBoardDate) {
        this.activityBoardDate = activityBoardDate;
    }

    public void setActivityBoardImgKey(String activityBoardImgKey) {
        this.activityBoardImgKey = activityBoardImgKey;
    }

    public void setActivityBoardPost(Boolean activityBoardPost) {
        this.activityBoardPost = activityBoardPost;
    }

    public void setRepository(Repository repository) {
        if (this.repository != null) {
            this.repository.getActivityBoards().remove(this);
        }
        this.repository = repository;
        repository.getActivityBoards().add(this);
    }
}
