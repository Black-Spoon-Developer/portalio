package com.example.portalio.domain.activityboard.service;

import com.example.portalio.common.oauth.dto.CustomOAuth2User;
import com.example.portalio.domain.activityboard.dto.ActivityBoardListResponse;
import com.example.portalio.domain.activityboard.dto.ActivityBoardRequest;
import com.example.portalio.domain.activityboard.dto.ActivityBoardResponse;
import com.example.portalio.domain.activityboard.entity.ActivityBoard;
import com.example.portalio.domain.activityboard.error.ActivityBoardNotFoundException;
import com.example.portalio.domain.activityboard.repisotory.ActivityBoardRepository;
import com.example.portalio.domain.board.dto.BoardListResponse;
import com.example.portalio.domain.board.entity.Board;
import com.example.portalio.domain.member.entity.Member;
import com.example.portalio.domain.member.error.MemberNotFoundException;
import com.example.portalio.domain.member.repository.MemberRepository;
import com.example.portalio.domain.repository.entity.Repository;
import com.example.portalio.domain.repository.error.RepositoryNotFoundException;
import com.example.portalio.domain.repository.error.RepositoryUnauthorizedAccessException;
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
    private final MemberRepository memberRepository;

    // 활동게시판 검색
    public ActivityBoardListResponse getActivityBoardSearch(String searchTerm) {
        List<ActivityBoard> activityBoards = activityBoardRepository.findByActivityBoardTitle(searchTerm);
        return ActivityBoardListResponse.from(activityBoards);
    }

    // 게시글 상세보기, params : activityId
    public ActivityBoardResponse getActivityBoardDetails(Long activityId) {

        ActivityBoard activityBoard = activityBoardRepository.findById(activityId)
                .orElseThrow(ActivityBoardNotFoundException::new);

        return ActivityBoardResponse.from(activityBoard);
    }

    public ActivityBoardListResponse getActivityBoardList(int skip, int limit) {

        Pageable pageable = PageRequest.of(skip/limit, limit);

        List<ActivityBoard> activityBoards = activityBoardRepository.findAllByOrderByCreatedDesc(pageable);

        return ActivityBoardListResponse.from(activityBoards);
    }

    public ActivityBoardListResponse getMyActivityBoardList(int skip, int limit, String username) {

        Member member = memberRepository.findByMemberUsername(username)
                .orElseThrow(MemberNotFoundException::new);

        Pageable pageable = PageRequest.of(skip/limit, limit);

        List<ActivityBoard> activityBoards = activityBoardRepository.findByMemberUsername(member.getMemberUsername(), pageable);

        return ActivityBoardListResponse.from(activityBoards);
    }

    public ActivityBoardListResponse getActivityBoardListDetail(Long repositoryId) {

        Repository repository = findRepository(repositoryId);

        List<ActivityBoard> activityBoards = activityBoardRepository.findAllByRepository_RepositoryId(repository.getRepositoryId());

        return ActivityBoardListResponse.from(activityBoards);
    }

    // 활동게시판 게시글 등록
    @Transactional
    public ActivityBoardResponse registerActivityBoard(ActivityBoardRequest request, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Repository repository = findMyRepository(request.getRepositoryId(), member.getMemberId());

        ActivityBoard activityBoard = ActivityBoard.of(request.getActivityBoardTitle(), request.getActivityBoardContent(), request.getActivityBoardDate());

        activityBoard.setRepository(repository);

        activityBoardRepository.save(activityBoard);

        return ActivityBoardResponse.from(activityBoard);
    }

    @Transactional
    public ActivityBoardResponse updateActivityBoard(Long repositoryId, Long activityId, ActivityBoardRequest request, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Repository repository = findMyRepository(repositoryId, member.getMemberId());

        ActivityBoard activityBoard = activityBoardRepository.findByActivityBoardIdAndRepository_RepositoryId(activityId, repository.getRepositoryId())
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

        activityBoardRepository.save(activityBoard);

        return ActivityBoardResponse.from(activityBoard);
    }

    // 활동 게시글 삭제
    @Transactional
    public ActivityBoardResponse deleteActivityBoard(Long repositoryId, Long activityId, CustomOAuth2User oauth2User) {

        Member member = findMember(oauth2User.getMemberId());

        Repository repository = findMyRepository(repositoryId, member.getMemberId());

        ActivityBoard activityBoard = activityBoardRepository.findByActivityBoardIdAndRepository_RepositoryId(activityId, repository.getRepositoryId())
                .orElseThrow(ActivityBoardNotFoundException::new);

        activityBoardRepository.delete(activityBoard);

        return ActivityBoardResponse.from(activityBoard);
    }

    private Repository findRepository(Long repositoryId) {

        return repositoryRepository.findById(repositoryId)
                .orElseThrow(RepositoryNotFoundException::new);
    }

    private Repository findMyRepository(Long repositoryId, Long memberId) {

        return repositoryRepository.findByRepositoryIdAndMember_MemberId(repositoryId, memberId)
                .orElseThrow(RepositoryUnauthorizedAccessException::new);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
    }
}
