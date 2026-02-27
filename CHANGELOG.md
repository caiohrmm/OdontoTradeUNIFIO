# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- (itens futuros)

---

## [0.3.0] - 2025-02-26

### Added

- **CRUD de Listings (anúncios):** entidade `Listing` e `ListingImage` (Flyway V3), título, descrição, preço, status (ACTIVE, SOLD, RESERVED), múltiplas URLs de imagem.
- **Listagem com filtros:** GET /api/v1/listings com paginação (page, size) e filtros opcionais: status, sellerId, search (título/descrição).
- **Rotas públicas:** GET /api/v1/listings e GET /api/v1/listings/{id} acessíveis sem autenticação; POST, PUT e DELETE exigem JWT e apenas o dono pode editar/excluir.
- Respostas paginadas (PagedResponse: content, totalElements, totalPages, size, number).
- ApiExceptionHandler: "Anúncio não encontrado" (404), "Sem permissão" (403).

---

## [0.2.0] - 2025-02-26

### Added

- Entidade **User** e tabela `user` (Flyway V2): id, email, password_hash, name, role, created_at, updated_at.
- Autenticação **JWT**: registro (POST /api/v1/auth/register), login (POST /api/v1/auth/login), usuário atual (GET /api/v1/users/me).
- Spring Security com filtro JWT; rotas públicas: health, actuator, Swagger, auth/register e auth/login; demais rotas em /api/v1/** exigem Bearer token.
- Configuração JWT via `jwt.secret` e `jwt.expiration-ms` (env: JWT_SECRET, JWT_EXPIRATION_MS).
- Respostas de erro padronizadas (ApiExceptionHandler): validação (400), e-mail já cadastrado (409), credenciais inválidas (401).
- Documentação OpenAPI com esquema Bearer JWT no Swagger UI.

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
