package com.example.portalio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PortalioApplication {

	public static void main(String[] args) {
		SpringApplication.run(PortalioApplication.class, args);
	}

}