//package com.example.portalio.activityboard;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//import com.example.portalio.domain.activityboard.entity.ActivityBoard;
//import com.example.portalio.domain.activityboard.error.ActivityBoardNotFoundException;
//import com.example.portalio.domain.activityboard.repisotory.ActivityBoardRepository;
//import com.example.portalio.domain.repository.entity.Repository;
//import com.example.portalio.domain.repository.repository.RepositoryRepository;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import java.time.LocalDate;
//import org.junit.jupiter.api.AfterEach;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.ContextConfiguration;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.transaction.annotation.Transactional;
//
//@SpringBootTest
//@ContextConfiguration
//@AutoConfigureMockMvc
//public class ActivityBoardRegisterTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Autowired
//    private ActivityBoardRepository activityBoardRepository;
//
//    @Autowired
//    private RepositoryRepository repositoryRepository;
//
//    private Repository testRepository;
//
//    @Transactional
//    @BeforeEach
//    void setUp() {
//        activityBoardRepository.deleteAll();
//        repositoryRepository.deleteAll();
//
//        testRepository = Repository.of(
//                "testRepositoryTitle",
//                "testRepositoryContent",
//                LocalDate.now(),
//                LocalDate.now().plusDays(1),
//                "testRepositoryImgKey",
//                "testRepositoryFileKey"
//        );
//        repositoryRepository.save(testRepository);
//    }
//
//    @AfterEach
//    void tearDown() {
//        activityBoardRepository.deleteAll();
//        repositoryRepository.deleteAll();
//    }
//
//    @Test
//    @DisplayName("ActivityBoard 게시글 등록 테스트")
//    @Transactional
//    void saveActivityBoard() {
//        // given : ActivityBoard 엔티티 생성
//        ActivityBoard activityBoard = ActivityBoard.of(
//                "testActivityTitle",
//                "testActivityContent",
//                LocalDate.now(),
//                "testActivityImgKey",
//                true
//        );
//
//        activityBoard.setRepository(testRepository);
//
//        ActivityBoard savedBoard = activityBoardRepository.save(activityBoard);
//
//        assertThat(savedBoard.getActivityBoardId()).isNotNull();
//        assertThat(savedBoard.getActivityBoardTitle()).isEqualTo("testActivityTitle").isNotNull();
//        assertThat(savedBoard.getActivityBoardContent()).isEqualTo("testActivityContent").isNotNull();
//        assertThat(savedBoard.getActivityBoardImgKey()).isEqualTo("testActivityImgKey").isNotNull();
//        assertThat(savedBoard.getRepository()).isEqualTo(testRepository).isNotNull();
//    }
//
//    @Test
//    @DisplayName("ActivityBoard 게시글 수정 테스트")
//    @Transactional
//    void updateActivityBoard() {
//        // given
//        ActivityBoard activityBoard = ActivityBoard.of(
//                "testActivityTitle",
//                "testActivityContent",
//                LocalDate.now(),
//                "testActivityImgKey",
//                true
//        );
//
//        activityBoard.setRepository(testRepository);
//
//        ActivityBoard savedBoard = activityBoardRepository.save(activityBoard);
//
//        // when : 게시글 수정
//        savedBoard.setActivityBoardTitle("changeActivityTitle");
//        savedBoard.setActivityBoardContent("changeActivityContent");
//        savedBoard.setActivityBoardImgKey("changeActivityImgKey");
//        savedBoard.setActivityBoardPost(false);
//        activityBoardRepository.save(savedBoard);
//
//        // then : 검증
//        ActivityBoard updatedBoard = activityBoardRepository.findById(savedBoard.getActivityBoardId()).orElseThrow(
//                ActivityBoardNotFoundException::new);
//        assertThat(updatedBoard.getActivityBoardTitle()).isEqualTo("changeActivityTitle").isNotNull();
//        assertThat(updatedBoard.getActivityBoardContent()).isEqualTo("changeActivityContent").isNotNull();
//        assertThat(updatedBoard.getActivityBoardImgKey()).isEqualTo("changeActivityImgKey").isNotNull();
//        assertThat(updatedBoard.getRepository()).isEqualTo(testRepository).isNotNull();
//        assertThat(updatedBoard.getActivityBoardPost()).isFalse();
//    }
//
//    @Test
//    @DisplayName("ActivityBoard 삭제 테스트")
//    @Transactional
//    void deleteActivityBoard() {
//        // given
//        ActivityBoard activityBoard = ActivityBoard.of(
//                "testActivityTitle",
//                "testActivityContent",
//                LocalDate.now(),
//                "testActivityImgKey",
//                true
//        );
//
//        activityBoard.setRepository(testRepository);
//
//        ActivityBoard savedBoard = activityBoardRepository.save(activityBoard);
//
//        // when : 삭제
//        activityBoardRepository.delete(savedBoard);
//        // then : 삭제 검증
//        boolean deleted = activityBoardRepository.existsById(savedBoard.getActivityBoardId());
//        assertThat(deleted).isFalse();
//    }
//}
