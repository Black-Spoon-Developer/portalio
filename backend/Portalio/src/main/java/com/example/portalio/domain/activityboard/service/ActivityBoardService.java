package com.example.portalio.domain.activityboard.service;

import com.example.portalio.domain.activityboard.dto.ActivityBoardListResponse;
import com.example.portalio.domain.activityboard.dto.ActivityBoardPostResponse;
import com.example.portalio.domain.activityboard.dto.ActivityBoardRequest;
import com.example.portalio.domain.activityboard.dto.ActivityBoardResponse;
import com.example.portalio.domain.activityboard.entity.ActivityBoard;
import com.example.portalio.domain.activityboard.error.ActivityBoardNotFoundException;
import com.example.portalio.domain.activityboard.repisotory.ActivityBoardRepository;
import com.example.portalio.domain.repository.entity.Repository;
import com.example.portalio.domain.repository.error.RepositoryNotFoundExcception;
import com.example.portalio.domain.repository.repository.RepositoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ActivityBoardService {

    private final ActivityBoardRepository activityBoardRepository;
    private final RepositoryRepository repositoryRepository;

    // 활동게시판 검색
    public ActivityBoardListResponse getActivityBoardSearch(String searchTerm) {
        List<ActivityBoard> activityBoards = activityBoardRepository.findByActivityBoardTitle(searchTerm);
        return ActivityBoardListResponse.from(activityBoards);
    }

    // 게시글 상세보기, params : activityId
    public ActivityBoardResponse getActivityBoardDetails(Long activityId) {

        ActivityBoard activityBoard = activityBoardRepository.findByActivityBoardId(activityId)
                .orElseThrow(ActivityBoardNotFoundException::new);

        return ActivityBoardResponse.from(activityBoard);
    }

    public ActivityBoardListResponse getActivityBoardList(int skip, int limit) {

        Pageable pageable = PageRequest.of(skip/limit, limit);

        List<ActivityBoard> activityBoards = activityBoardRepository.findAllByActivityBoardPostTrueOrderByCreatedDesc(pageable);

        return ActivityBoardListResponse.from(activityBoards);
    }

    public ActivityBoardListResponse getActivityBoardListDetail(Long repositoryId) {

        Repository repository = findRepository(repositoryId);

        return ActivityBoardListResponse.from(repository.getActivityBoards());
    }

    // 활동게시판 게시글 등록
    @Transactional
    public ActivityBoardResponse registerActivityBoard(ActivityBoardRequest request, Long repositoryId) {

        Repository repository = findRepository(repositoryId);

        ActivityBoard activityBoard = ActivityBoard.of(request.getActivityBoardTitle(), request.getActivityBoardContent(), request.getActivityBoardDate(), request.getActivityBoardImgKey(), request.getActivityBoardPost());

        activityBoard.setRepository(repository);

        activityBoardRepository.save(activityBoard);

        return ActivityBoardResponse.from(activityBoard);
    }

    @Transactional
    public ActivityBoardResponse updateActivityBoard(Long activityId, ActivityBoardRequest request) {

        ActivityBoard activityBoard = activityBoardRepository.findByActivityBoardId(activityId)
                .orElseThrow(ActivityBoardNotFoundException::new);

        if(request.getActivityBoardTitle() != null) {
            activityBoard.setActivityBoardTitle(request.getActivityBoardTitle());
        }
        if(request.getActivityBoardContent() != null) {
            activityBoard.setActivityBoardContent(request.getActivityBoardContent());
        }
        if(request.getActivityBoardDate() != null) {
            activityBoard.setActivityBoardDate(request.getActivityBoardDate());
        }
        if(request.getActivityBoardImgKey() != null) {
            activityBoard.setActivityBoardImgKey(request.getActivityBoardImgKey());
        }
        if(request.getActivityBoardPost() != null) {
            activityBoard.setActivityBoardPost(request.getActivityBoardPost());
        }

        activityBoardRepository.save(activityBoard);

        return ActivityBoardResponse.from(activityBoard);
    }

    // 활동 게시글 삭제
    @Transactional
    public ActivityBoardResponse deleteActivityBoard(Long activityId) {

        ActivityBoard activityBoard = activityBoardRepository.findByActivityBoardId(activityId)
                .orElseThrow(ActivityBoardNotFoundException::new);

        activityBoardRepository.delete(activityBoard);

        return ActivityBoardResponse.from(activityBoard);
    }

    @Transactional
    public ActivityBoardPostResponse postActivityBoard(Long activityId) {

        ActivityBoard activityBoard = activityBoardRepository.findByActivityBoardId(activityId)
                .orElseThrow(ActivityBoardNotFoundException::new);

        activityBoard.setActivityBoardPost(!activityBoard.getActivityBoardPost());

        activityBoardRepository.save(activityBoard);

        return ActivityBoardPostResponse.from(activityBoard);
    }

    private Repository findRepository(Long repositoryId) {

        return repositoryRepository.findByRepositoryId(repositoryId)
                .orElseThrow(RepositoryNotFoundExcception::new);
    }
}
