//package com.example.portalio.activityboard;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.junit.jupiter.api.Assertions.assertThrows;
//
//import com.example.portalio.domain.activityboard.entity.ActivityBoard;
//import com.example.portalio.domain.activityboard.error.ActivityBoardNotFoundException;
//import com.example.portalio.domain.activityboard.repisotory.ActivityBoardRepository;
//import com.example.portalio.domain.repository.entity.Repository;
//import com.example.portalio.domain.repository.repository.RepositoryRepository;
//import java.time.LocalDate;
//import org.hibernate.Hibernate;
//import org.junit.jupiter.api.AfterEach;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.ContextConfiguration;
//import org.springframework.transaction.annotation.Transactional;
//
//@SpringBootTest
//@ContextConfiguration
//@AutoConfigureMockMvc
//public class ActivityBoardGetTest {
//
//    @Autowired
//    private ActivityBoardRepository activityBoardRepository;
//
//    @Autowired
//    private RepositoryRepository repositoryRepository;
//
//    private Repository testRepository;
//    private ActivityBoard testActivityBoard;
//
//    @BeforeEach
//    @Transactional
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
//
//        testActivityBoard = ActivityBoard.of(
//                "testActivityTitle",
//                "testActivityContent",
//                LocalDate.now(),
//                "testActivityImgKey",
//                true
//        );
//        testActivityBoard.setRepository(testRepository);
//        activityBoardRepository.save(testActivityBoard);
//    }
//
//    @AfterEach
//    void tearDown() {
//        activityBoardRepository.deleteAll();
//        repositoryRepository.deleteAll();
//    }
//
//    @Test
//    @DisplayName("ActivityBoard ID로 조회 성공 테스트")
//    @Transactional
//    void getActivityBoardId() {
//        Long activityBoardId = testActivityBoard.getActivityBoardId();
//
//        ActivityBoard foundActivityBoard = activityBoardRepository.findById(activityBoardId)
//                .orElseThrow(ActivityBoardNotFoundException::new);
//
//        assertThat(foundActivityBoard).isNotNull();
//        assertThat(foundActivityBoard.getActivityBoardTitle()).isEqualTo(testActivityBoard.getActivityBoardTitle());
//        assertThat(foundActivityBoard.getActivityBoardContent()).isEqualTo(testActivityBoard.getActivityBoardContent());
//        assertThat(foundActivityBoard.getActivityBoardImgKey()).isEqualTo(testActivityBoard.getActivityBoardImgKey());
//        assertThat(foundActivityBoard.getActivityBoardDate()).isEqualTo(testActivityBoard.getActivityBoardDate());
//        assertThat(foundActivityBoard.getActivityBoardPost()).isEqualTo(testActivityBoard.getActivityBoardPost());
//        assertThat(foundActivityBoard.getRepository()).isEqualTo(testRepository);
//    }
//
//    @Test
//    @DisplayName("존재하지 않는 ActivityBoard ID로 조회 테스트")
//    @Transactional
//    void getActivityBoardId_NotFound() {
//        Long NotFoundactivityBoardId = 999L;
//
//        assertThrows(ActivityBoardNotFoundException.class, () -> {
//            activityBoardRepository.findById(NotFoundactivityBoardId)
//                    .orElseThrow(ActivityBoardNotFoundException::new);
//        });
//    }
//}
