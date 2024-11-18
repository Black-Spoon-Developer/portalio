package com.example.portalio.mongo.repository;

import com.example.portalio.mongo.document.FileDocument;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface FileRepository extends MongoRepository<FileDocument, String> {

    // 특정 documentId로 fileUrls와 name 필드만 조회
    @Query(value = "{ '_id': ?0 }", fields = "{ 'fileUrls': 1, 'fileNames': 1 }")
    Optional<FileDocument> findFileUrlsAndFileNames(String documentId);
}
