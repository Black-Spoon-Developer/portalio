package com.example.portalio.domain.activityboard.dto;

import com.example.portalio.domain.activityboard.entity.ActivityBoard;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ActivityBoardListResponse {

    private final List<ActivityBoardResponse> items;

    public static ActivityBoardListResponse from(List<ActivityBoard> activityBoards) {
        List<ActivityBoardResponse> items = activityBoards.stream()
                .map(ActivityBoardResponse::from)
                .toList();

        return new ActivityBoardListResponse(items);
    }
}
