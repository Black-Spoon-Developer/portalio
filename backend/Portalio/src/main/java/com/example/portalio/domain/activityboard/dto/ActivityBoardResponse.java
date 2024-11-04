package com.example.portalio.domain.activityboard.dto;

import com.example.portalio.domain.activityboard.entity.ActivityBoard;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ActivityBoardResponse {

    private static final String DEFAULT_IMAGE_URL = "https://avatars.githubusercontent.com/u/157494028?v=4";

    private Long activityBoardId;
    private String activityBoardTitle;
    private String activityBoardContent;
    private LocalDate activityBoardDate;
    private Boolean activityBoardPost;
    private String activityBoardImageKey;
    private Long repositoryId;

    public static ActivityBoardResponse from(ActivityBoard activityBoard) {
        return ActivityBoardResponse.builder()
                .activityBoardId(activityBoard.getActivityBoardId())
                .activityBoardTitle(activityBoard.getActivityBoardTitle())
                .activityBoardContent(activityBoard.getActivityBoardContent())
                .activityBoardDate(activityBoard.getActivityBoardDate())
                .activityBoardPost(activityBoard.getActivityBoardPost())
                .repositoryId(activityBoard.getRepository().getRepositoryId())
                .build();
    }
}
