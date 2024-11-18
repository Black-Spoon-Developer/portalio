package com.example.portalio.domain.activityboard.dto;

import com.example.portalio.domain.activityboard.entity.ActivityBoard;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ActivityBoardResponse {

    private Long activityBoardId;
    private String activityBoardTitle;
    private String activityBoardContent;
    private LocalDate activityBoardDate;
    private LocalDateTime created;
    private Long repositoryId;
    private Long memberId;
    private String memberUsername;
    private String memberNickname;
    private String picture;

    public static ActivityBoardResponse from(ActivityBoard activityBoard) {
        return ActivityBoardResponse.builder()
                .activityBoardId(activityBoard.getActivityBoardId())
                .activityBoardTitle(activityBoard.getActivityBoardTitle())
                .activityBoardContent(activityBoard.getActivityBoardContent())
                .activityBoardDate(activityBoard.getActivityBoardDate())
                .created(activityBoard.getCreated())
                .repositoryId(activityBoard.getRepository().getRepositoryId())
                .memberId(activityBoard.getRepository().getMember().getMemberId())
                .memberUsername(activityBoard.getRepository().getMember().getMemberUsername())
                .memberNickname(activityBoard.getRepository().getMember().getUserDetail().getUserNickname())
                .picture(activityBoard.getRepository().getMember().getMemberPicture())
                .build();
    }
}
