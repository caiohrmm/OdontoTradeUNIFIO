# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- (itens futuros)

---

## [0.1.0] - 2025-02-26

### Added

- Bootstrap do backend Spring Boot 3 (Java 17, Maven).
- Configuração PostgreSQL (local via Docker Compose e Neon via variáveis de ambiente).
- Flyway com migration inicial `V1__init.sql`.
- Spring Data JPA com `ddl-auto=validate`.
- Endpoint `GET /api/v1/health` com resposta padronizada (ApiResponse).
- OpenAPI/Swagger (springdoc) em `/swagger-ui.html` e `/v3/api-docs`.
- Actuator com endpoint `/actuator/health`.
- CORS configurável via `FRONTEND_ORIGIN`.
- Estrutura de pacotes (vertical slice): `common`, `health`, preparado para próximas features.
