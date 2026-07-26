package com.cloudats.auth.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CloudATS Auth Service API")
                        .version("1.0.0")
                        .description("Authentication and Authorization API for the CloudATS recruitment platform. " +
                                "Handles user registration, login, JWT token management, and role-based access control.")
                        .contact(new Contact()
                                .name("Ayushman Behera")
                                .email("ayushman@cloudats.dev")))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT access token")));
    }
}
