//package com.example.portalio.s3;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.anyString;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//import com.example.portalio.s3.controller.AwsS3Controller;
//import com.example.portalio.s3.service.AwsS3Service;
//import java.util.ArrayList;
//import java.util.List;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.mock.web.MockMultipartFile;
//import org.springframework.test.web.servlet.MockMvc;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//public class S3ImageUploadTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Mock
//    private AwsS3Service awsS3Service;
//
//    @InjectMocks
//    private AwsS3Controller awsS3Controller;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    void uploadImage_shouldReturn200_whenFilesAreUploadedSuccessfully() throws Exception {
//        String folderName = "Portfolio_board";
//        // given 준비
//        MockMultipartFile videoFile = new MockMultipartFile("multipartFile", "sample_video.mp4", "video/mp4", "dummy video content".getBytes());
//        MockMultipartFile imageFile = new MockMultipartFile("multipartFile", "sample_image.png", "image/png", "dummy image content".getBytes());
//        MockMultipartFile pdfFile = new MockMultipartFile("multipartFile", "sample_document.pdf", "application/pdf", "dummy pdf content".getBytes());
//
//        List<MockMultipartFile> files = new ArrayList<>();
//        files.add(videoFile);
//        files.add(imageFile);
//        files.add(pdfFile);
//
//        when(awsS3Service.upLoadFile(any(List.class), anyString())).thenReturn("Uploaded Successfully");
//
//        // when 실행
//        // then 검증
//        mockMvc.perform(multipart("/s3/image")
//                .file(videoFile)
//                .file(imageFile)
//                .file(pdfFile)
//                .param("folderName", folderName)
//                .contentType(MediaType.MULTIPART_FORM_DATA))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    void uploadImage_shouldReturn400_whenFolerIsMissing() throws Exception {
//        // given 준비
//        MockMultipartFile file1 = new MockMultipartFile("multipartFile", "image1.jpg", "image/jpg", "dummy image content".getBytes());
//
//        // when & then (실행 & 검증)
//        mockMvc.perform(multipart("/s3/image")
//                        .file(file1)
//                        .contentType(MediaType.MULTIPART_FORM_DATA))
//                        .andExpect(status().isBadRequest());
//    }
//}
