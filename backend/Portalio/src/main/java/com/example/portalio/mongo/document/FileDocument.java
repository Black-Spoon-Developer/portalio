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

    public FileDocument(List<String> fileUrls) {
        this.fileUrls = fileUrls;
    }
}
