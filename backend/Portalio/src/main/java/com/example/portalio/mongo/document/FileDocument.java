package com.example.portalio.mongo.document;

import java.util.List;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Document(collection = "portalio")
public class FileDocument {

    @Id
    private String id;
    private List<String> fileUrls;
    private List<String> fileNames;

    public FileDocument(List<String> fileUrls, List<String> fileNames) {
        this.fileUrls = fileUrls;
        this.fileNames = fileNames;
    }
}
