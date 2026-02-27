# unifio-odonto-desapego-backend

Backend da aplicação **Odonto Desapego** (projeto integrador Unifio). API REST em Spring Boot para gestão de anúncios e funcionalidades do sistema, sem intermediação de pagamentos. Imagens são armazenadas apenas como URLs (upload em fase futura).

## Stack

| Item        | Tecnologia              |
|------------|-------------------------|
| Linguagem  | Java 17                 |
| Framework  | Spring Boot 3           |
| Banco      | PostgreSQL (Neon ou local) |
| ORM        | Spring Data JPA (Hibernate) |
| Migrações  | Flyway                  |
| Documentação | OpenAPI/Swagger (springdoc) |
| Build      | Maven                   |

## Pré-requisitos

- **Java 17**
- **Maven 3.8+**
- **Docker** e **Docker Compose** (para Postgres local)
- Conta **Neon** (opcional, para banco em nuvem)

## Como rodar localmente (Docker Compose + Postgres)

1. Suba o Postgres:

   ```bash
   docker compose up -d
   ```

2. Rode a aplicação com o profile `local`:

   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=local
   ```

3. A API estará em **http://localhost:8080**.

## Como configurar Neon (PostgreSQL em nuvem)

No painel do [Neon](https://neon.tech) crie um projeto e copie a **connection string** (formato `postgresql://user:password@host/dbname?sslmode=require`).

Configure as variáveis de ambiente (ou um `.env` que não vai pro Git):

- **SPRING_DATASOURCE_URL** — URL JDBC. Neon entrega URL no formato `postgresql://...`. Use no JDBC:  
  `jdbc:postgresql://HOST/DB?sslmode=require`  
  (substitua HOST e DB pelos valores do Neon).
- **SPRING_DATASOURCE_USERNAME** — usuário do banco.
- **SPRING_DATASOURCE_PASSWORD** — senha do banco.

Exemplo (Linux/macOS):

```bash
export SPRING_DATASOURCE_URL="jdbc:postgresql://ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
export SPRING_DATASOURCE_USERNAME="seu_usuario"
export SPRING_DATASOURCE_PASSWORD="sua_senha"
mvn spring-boot:run
```

No Windows (PowerShell):

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
$env:SPRING_DATASOURCE_USERNAME="seu_usuario"
$env:SPRING_DATASOURCE_PASSWORD="sua_senha"
mvn spring-boot:run
```

Sem definir essas variáveis, o padrão é `localhost:5432` (compatível com o Docker Compose).

## Autenticação (JWT)

- **POST /api/v1/auth/register** — Registro (nome, e-mail, senha). Retorna token JWT.
- **POST /api/v1/auth/login** — Login (e-mail, senha). Retorna token JWT.
- **GET /api/v1/users/me** — Dados do usuário autenticado (requer header `Authorization: Bearer <token>`).

Variáveis de ambiente opcionais:
- **JWT_SECRET** — Chave para assinar o JWT (mín. 32 caracteres). Em produção use um valor forte.
- **JWT_EXPIRATION_MS** — Validade do token em ms (padrão: 86400000 = 24h).

## Endpoints técnicos

| Endpoint | Descrição |
|----------|-----------|
| **GET /api/v1/health** | Healthcheck da API (status + timestamp). Documentado no Swagger. |
| **GET /actuator/health** | Health do Spring Boot Actuator. |
| **GET /swagger-ui.html** | Interface Swagger UI. |
| **GET /v3/api-docs** | Especificação OpenAPI (JSON). |

## CORS

O backend aceita requisições do frontend configurado em **FRONTEND_ORIGIN**. Valor padrão: `http://localhost:3000`. Para múltiplas origens, use uma lista separada por vírgula (ex.: `http://localhost:3000,https://app.exemplo.com`).

## Convenções do repositório

- **Prefixo da API:** `/api/v1`
- **Pacote base:** `br.edu.unifio.odonto.desapego`
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) (ex.: `feat:`, `fix:`, `docs:`)
- **Branch principal:** `main`

Para regras de contribuição, branches e PRs, veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

Projeto acadêmico Unifio.
