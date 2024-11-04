package com.example.portalio.domain.activityboard.dto;

import com.example.portalio.domain.activityboard.entity.ActivityBoard;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ActivityBoardPostResponse {
    private Long activityBoardId;
//    private Long memberId;
    private Boolean activityBoardPost;

    public static ActivityBoardPostResponse from(ActivityBoard activityBoard) {
        return ActivityBoardPostResponse.builder()
                .activityBoardId(activityBoard.getActivityBoardId())
//                .memberId(activityBoard.getRepository().getMember().getMemberId())
                .activityBoardPost(activityBoard.getActivityBoardPost())
                .build();
    }
}
