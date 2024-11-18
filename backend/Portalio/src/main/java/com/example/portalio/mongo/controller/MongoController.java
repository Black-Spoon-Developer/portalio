package com.example.portalio.mongo.controller;

import com.example.portalio.mongo.document.FileDocument;
import com.example.portalio.mongo.service.FileService;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/files")
public class MongoController {

    private final FileService fileService;

    @GetMapping("/info/{documentId}")
    public FileDocument getFileUrlsAndName(@PathVariable String documentId) {
        return fileService.getFileUrlsAndNameByDocumentId(documentId);
    }
}
