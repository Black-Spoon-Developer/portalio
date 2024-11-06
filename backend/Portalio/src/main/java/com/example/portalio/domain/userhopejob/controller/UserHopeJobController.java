//package com.example.portalio.domain.userhopejob.controller;
//
//import com.example.portalio.domain.userhopejob.entity.UserHopeJob;
//import com.example.portalio.domain.userhopejob.service.UserhopejobService;
//import io.swagger.v3.oas.annotations.Operation;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api/v1/job")
//public class UserHopeJobController {
//
//    private final UserhopejobService userhopejobService;
//
//    @Operation(summary = "[직무] 직무 정보 저장", description = "memberId, JobsubcategoryId 값으로 저장")
//    @PostMapping("/save/{memberId}/{jobsubcategoryId}")
//    public ResponseEntity<?> jobInfoSave(@PathVariable("memberId") Long memberId,
//                                         @PathVariable("jobsubcategoryId") Long jobsubcategoryId) {
//
//        try {
//            UserHopeJob userHopeJob = userhopejobService.saveUserHopeJob(jobsubcategoryId, memberId);
//            return ResponseEntity.ok(userHopeJob);
//        } catch (Exception e) {
//            // 예상치 못한 예외가 발생한 경우
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("직무 정보 처리 중 에러가 발생했습니다.");
//        }
//    }
//}
