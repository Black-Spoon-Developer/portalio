package com.example.portalio.domain.repository.dto;

import com.example.portalio.domain.repository.entity.Repository;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class RepositoryListResponse {

    private final List<RepositoryResponse> items;

    public static RepositoryListResponse from(List<Repository> repositorys) {
        List<RepositoryResponse> items = repositorys.stream()
                .map(RepositoryResponse::from)
                .toList();

        return new RepositoryListResponse(items);
    }
}
