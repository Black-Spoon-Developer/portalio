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

    @Column(name = "activity_board_content", nullable = false, columnDefinition = "TEXT")
    private String activityBoardContent;

    @Column(name = "activity_board_date", nullable = false)
    private LocalDate activityBoardDate;

    @Column(name = "activity_board_img_key", nullable = false, columnDefinition = "TEXT")
    private String activityBoardImgKey;

    @Column(name = "activity_board_post", nullable = false)
    private boolean activityBoardPost = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id")
    private Repository repository;
}
