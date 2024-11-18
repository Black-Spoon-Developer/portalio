package com.example.portalio.domain.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import java.time.LocalDateTime;
import lombok.Getter;
import org.springframework.data.annotation.LastModifiedDate;

@MappedSuperclass
@Getter
public class AuditableEntity extends AuditableCreatedEntity {

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime modified;
}
