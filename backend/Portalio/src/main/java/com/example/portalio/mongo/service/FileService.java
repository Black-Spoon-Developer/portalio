package com.example.portalio.mongo.service;

import com.example.portalio.mongo.document.FileDocument;
import com.example.portalio.mongo.repository.FileRepository;
import java.util.List;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@NoArgsConstructor
public class FileService {

    private FileRepository fileRepository;

    public String saveFileUrls(List<String> fileUrls) {
        FileDocument fileDocument = new FileDocument(fileUrls);
        fileDocument = fileRepository.save(fileDocument);
        return fileDocument.getId();
    }

    public List<String> getFileUrls(String id) {
        return fileRepository.findById(id).map(FileDocument::getFileUrls).orElse(null);
    }
}
