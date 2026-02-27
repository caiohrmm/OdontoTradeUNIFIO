# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- (itens futuros)

---

## [0.5.0] - 2025-02-26

### Added

- **Feature 5: Upload de imagens com Cloudinary.** Endpoint **POST /api/v1/upload** (multipart/form-data, campo `file`), requer autenticação JWT.
- Integração com SDK Cloudinary (cloudinary-http5): upload para pasta configurável, retorno da URL segura (`secure_url`) no corpo da resposta.
- Configuração via env: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`; opcionais: `CLOUDINARY_FOLDER` (default `desapego`), `CLOUDINARY_MAX_FILE_SIZE_MB` (default 5).
- Validação: apenas imagens (JPEG, PNG, GIF, WebP) e tamanho máximo configurável; erros 400 para tipo/tamanho inválido, 503 quando Cloudinary não está configurado, 502 em falha de upload.
- Bean Cloudinary condicional (`@ConditionalOnProperty`); serviço de upload disponível mesmo sem credenciais (retorna 503 ao chamar upload).
- Limite multipart Spring: 10 MB (max-file-size e max-request-size).
- ApiExceptionHandler: IllegalStateException (503), RuntimeException com "Falha no upload" (502).

---

## [0.4.0] - 2025-02-26

### Added

- **Feature 4: Categorias.** Tabela `category` (Flyway V4): id, name, slug (único), description, created_at, updated_at.
- **CRUD de categorias:** GET /api/v1/categories (listar), GET /api/v1/categories/{id}, POST, PUT, DELETE (auth). Listagem e busca por ID públicas.
- **Listing com categoria:** coluna `listing.category_id` (opcional). Create/Update de anúncio aceitam `categoryId`; respostas incluem `categoryId` e `categoryName`.
- **Filtro por categoria:** GET /api/v1/listings?categoryId=... para listar anúncios de uma categoria.
- Slug gerado automaticamente a partir do nome quando não informado; validação de slug único (409 em conflito).
- ApiExceptionHandler: "Categoria não encontrada" (404), conflito de slug (409).
- Security: GET /api/v1/categories e GET /api/v1/categories/** permitAll.

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
