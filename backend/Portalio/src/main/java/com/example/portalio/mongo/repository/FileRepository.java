package com.example.portalio.mongo.repository;

import com.example.portalio.mongo.document.FileDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FileRepository extends MongoRepository<FileDocument, String> {
}
