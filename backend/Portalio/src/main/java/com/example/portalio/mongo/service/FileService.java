package com.example.portalio.mongo.service;

import com.example.portalio.mongo.document.FileDocument;
import com.example.portalio.mongo.repository.FileRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;

    public FileDocument getFileUrlsAndNameByDocumentId(String documentId) {
        return fileRepository.findFileUrlsAndFileNames(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }
}
